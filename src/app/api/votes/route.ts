import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

interface Vote {
  name: string;
  date: string;
  timestamp: string;
}

const VOTES_KEY = "baby-votes";

async function getVotes(): Promise<Record<string, Vote[]>> {
  try {
    const votes = await kv.get<Record<string, Vote[]>>(VOTES_KEY);
    return votes || {};
  } catch {
    return {};
  }
}

async function saveVotes(votes: Record<string, Vote[]>): Promise<void> {
  await kv.set(VOTES_KEY, votes);
}

export async function GET() {
  const votes = await getVotes();

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

  const votes = await getVotes();

  if (!votes[date]) {
    votes[date] = [];
  }

  votes[date].push({
    name: name.trim(),
    date,
    timestamp: new Date().toISOString(),
  });

  await saveVotes(votes);

  return NextResponse.json({ success: true, date, name });
}
