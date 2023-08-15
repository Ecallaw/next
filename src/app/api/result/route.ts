import { NextResponse } from "next/server";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();


export async function GET() {
  try {

    const countUser = await prisma.user.count()
    const countMatch = await prisma.match.count()
    const matchs  = await prisma.match.findMany({
      include: {
        game: true,
        scores: {
          include: { user: true }
        },
      },
    });

    const userScores  = await prisma.user.findMany({
      include: {
        scores: {
          select : { result: true, matchId: true }
        },
      },
    }); 

    return NextResponse.json({countUser, countMatch, matchs, userScores});
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}