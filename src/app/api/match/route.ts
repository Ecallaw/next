
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { compare } from "@/utils/misc";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const req = await request.json();
  const sortedScores = await req.scores.sort(compare);

  for (let i = 0; i < sortedScores.length; i++) {
    const entry = sortedScores[i];
    entry.result = sortedScores.length - i;
  }

  try {
    const match = await prisma.match.create({
      data: {
        gameId: req.gameId,
        scores: {
          create: [...sortedScores],
        },
      },
    }) as any;
    return NextResponse.json({ message: match + "match created", ok: true });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}


export async function GET(request: Request) {
  const url = new URL(request.url)
  const skip = url.searchParams.get("skip")
  const take = url.searchParams.get("take")
  try {
    const count = await prisma.match.count()
    const matchs = await prisma.match.findMany({
      skip: parseInt(skip ?? '0'),
      take: parseInt(take ?? '5'),
      orderBy: {
        createdAt: "desc",
      },
      include: {
        game: true,
        scores: {
          include: { user: true }
        },
      },
      
    });

    return NextResponse.json({matchs, count});
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const matchsDeleted = await prisma.match.deleteMany({
      where: {
        gameId:  { not: null }
      },
    });

    return NextResponse.json({ message: "remove all match removed", ok: true });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }}