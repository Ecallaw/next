
import { NextResponse } from "next/server";
import { Game, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


export async function POST(request: Request) {
  const req = await request.json();
  try {
    const game = await prisma.game.create({
      data: {
        name: req.name,
        nbPlayer: parseInt(req.nbPlayer),
        duration: parseInt(req.duration)
      } as Game
    })
    return NextResponse.json({ message: game + "Game created", ok: true })
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}


export async function GET() {
  try {
    const games = await prisma.game.findMany({
      orderBy: {
        name: 'asc',
      },
    }
    )
    return NextResponse.json(games)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}