import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

interface Vote {
  name: string;
  date: string;
  timestamp: string;
}

const VOTES_KEY = "baby-votes";

export async function GET() {
  const votes = (await redis.get<Record<string, Vote[]>>(VOTES_KEY)) || {};

  const summary: Record<string, { count: number; names: string[] }> = {};
  for (const [date, dateVotes] of Object.entries(votes)) {
    summary[date] = {
      count: dateVotes.length,
      names: dateVotes.map((v) => v.name),
    };
  }

  return NextResponse.json(summary);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, date } = body;

  if (!name || !date) {
    return NextResponse.json(
      { error: "Nombre y fecha son requeridos" },
      { status: 400 }
    );
  }

  const votes =
    (await redis.get<Record<string, Vote[]>>(VOTES_KEY)) || {};

  if (!votes[date]) {
    votes[date] = [];
  }

  votes[date].push({
    name: name.trim(),
    date,
    timestamp: new Date().toISOString(),
  });

  await redis.set(VOTES_KEY, votes);

  return NextResponse.json({ success: true, date, name });
}
