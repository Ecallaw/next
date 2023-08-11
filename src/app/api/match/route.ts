
import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'
import { compare } from "@/utils/misc";

const prisma = new PrismaClient()

//how to fix any
export async function POST(request: Request) {
  const req = await request.json();
  const sortedScores = await req.scores.sort(compare);

  for (let i = 0; i < sortedScores.length; i++) {
    const entry = sortedScores[i];
    entry.result = sortedScores.length - i
  }

  try {
    const match = await prisma.match.create({
      data: {
        gameId: req.gameId,
        scores: {
          create: [...sortedScores],
        },
      },
    }) as any
    return NextResponse.json({ message: match + "match created", ok: true })
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}


export async function GET() {
  try {
    const matchs = await prisma.match.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        game: true,
        scores: {
          include: { user: true }
        },
      },
    })
    return NextResponse.json(matchs)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}