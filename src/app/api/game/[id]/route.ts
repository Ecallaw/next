import { NextResponse } from "next/server";
import { Game, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function PUT(request: Request,
  { params }: { params: { id: string}}) {
  const req = await request.json();
  try {
    const updatedGame = await prisma.game.update({
      where: {
        id: parseInt(params.id),
      },
      data: {
        name: req.name,
      } as Game
    });

    return NextResponse.json({ updatedGame: updatedGame, message: "id : " + updatedGame.id + " : match removed", ok: true });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}


