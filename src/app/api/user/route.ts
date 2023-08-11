import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


type userProps = {
  name: string
  isRed: boolean
}

export async function POST(request: Request) {
  const req = await request.json();
  try {
    const user = await prisma.user.create({
      data: {
        name: req.name,
        isRed: req.isRed
      } as userProps
    })
    return NextResponse.json({ message: user.name + "Player added", ok: true })
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}


export async function GET() {
  try {
    const users = await prisma.user.findMany()
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}