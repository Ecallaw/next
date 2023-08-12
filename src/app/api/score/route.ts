
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type scoreProps = {
  matchId: string
  userId: string
  score: number
}
export async function POST(request: Request) {
  const req = await request.json();
  try {
    const score = await prisma.entryScore.create({
      data: {
        matchId: req.matchId,
        userId: req.userId,
        score: req.score
      } as any
    });
    return NextResponse.json({ message: score + "Player added", ok: true });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}


export async function GET() {
  try {
    const users = await prisma.entryScore.findMany({
      include: {
        match: {
          select: {
            game: {
              select: {
                duration: true,
              }
            },
          }
        },
        user: {
          select: {
            isRed: true,
          },
        }
      }
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const scoresDeleted = await prisma.entryScore.deleteMany({
      where: {
        matchId:  { not: null }
      },
    });

    return NextResponse.json({ message: "remove all score removed", ok: true });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }}