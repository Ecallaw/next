import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function DELETE(request: Request,
  { params }: {
    params: { id: string }
  }) {
  try {
    const matchDeleted = await prisma.match.delete({
      where: {
        id: parseInt(params.id),
      },
      include: {
        game : { select : { name  : true}}
      }
    });

    return NextResponse.json({ matchDeleted: matchDeleted, message: "id : " + matchDeleted.id + " : match removed", ok: true });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}


