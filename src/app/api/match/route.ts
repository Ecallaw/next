
import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

//how to fix any
export async function POST(request: Request) {
  const req = await request.json();

  console.log("req", req.score.fore)
  try {

    const match = await prisma.match.create({
      data: {
        gameId: req.gameId,
        EntryScore: {
          create: req.score,
        },
      },
    }) as any
    return NextResponse.json({ error: "error" }, { status: 500 })

    return NextResponse.json({ message: match + "match created", ok: true })
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}


export async function GET() {
  try {
    const matchs = await prisma.match.findMany()
    return NextResponse.json(matchs)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}