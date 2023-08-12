import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function DELETE(request: Request,
  { params }: {
    params: { id: string }
  }) {
  try {
    const userDeleted = await prisma.user.delete({
      where: {
        id: parseInt(params.id),
      },
    });

    return NextResponse.json({ name: userDeleted.name, message: "id : " + userDeleted.id + " : player removed", ok: true });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
