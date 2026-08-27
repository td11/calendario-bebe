import { createClient } from "redis";
import { NextResponse } from "next/server";

let redis: ReturnType<typeof createClient> | null = null;

async function getRedis() {
  if (!redis) {
    redis = createClient({ url: process.env.REDIS_URL! });
    redis.on("error", (err) => console.error("Redis error", err));
    await redis.connect();
  }
  return redis;
}

interface Vote {
  name: string;
  date: string;
  timestamp: string;
}

const VOTES_KEY = "baby-votes";

export async function GET() {
  const client = await getRedis();
  const raw = await client.get(VOTES_KEY);
  const votes: Record<string, Vote[]> = raw ? JSON.parse(raw) : {};

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

  const client = await getRedis();
  const raw = await client.get(VOTES_KEY);
  const votes: Record<string, Vote[]> = raw ? JSON.parse(raw) : {};

  if (!votes[date]) {
    votes[date] = [];
  }

  votes[date].push({
    name: name.trim(),
    date,
    timestamp: new Date().toISOString(),
  });

  await client.set(VOTES_KEY, JSON.stringify(votes));

  return NextResponse.json({ success: true, date, name });
}
