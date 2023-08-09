import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


export async function getAllUsers() {
  const users = await prisma.user.findMany();

  return users ?? [];
}

export async function createUser({
  name,
}: {
  name: string;
}) {
  const user = await prisma.user.create({
    data: {
      name,
    },
  });

  return user;
}
