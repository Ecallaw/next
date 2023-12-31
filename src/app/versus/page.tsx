import { PrismaClient } from '@prisma/client'
import Debbug from '@/components/debbug'
import Image from 'next/image'
import Link from 'next/link'

const prisma = new PrismaClient()


export default async function Versus() {
  const users = await prisma.user.findMany()

  return (
    <main className="bg-black flex min-h-[calc(100vh-2rem)] flex-col justify-between">
      <Debbug data={users} />
      <div className="flex flex-col">
        <div className='bg-gray-500 p-6 text-2xl'>Fight</div>

        <div className="flex flex-col justify-start">
          {users.map(user => {
            return (
              <div key={user.id}  className='flex-grow m-4'>{user.name}</div>
            )
          })
          }
        </div>
      </div>
    </main>
  )
}
