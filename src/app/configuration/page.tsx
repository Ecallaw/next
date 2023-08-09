
'use client'
import Dialog from '@/components/Dialog'
import { useEffect, useState } from 'react'
import { IconCheck, IconX } from '@tabler/icons-react';
import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { getUsers } from '../requests/user';



// const getUsers = async () => {
//   const data = await fetch('/api/user', {
//     method: "GET",
//   })
//   return await data.json()
// }

const deleteUser = async (id: string) => {
  const data = await fetch('/api/user/' + id, {
    method: "DELETE",
  })
  const res = await data.json()
  if (!res.ok) {
    notifications.show({
      title: "Impossible de supprimer le joueur",
      message: res.error,
      color: 'red',
      icon: <IconX />,
    })
  } else {
    notifications.show({
      title: "Suppression réussite !",
      message: res.name + " a été supprimer",
      color: 'green',
      icon: <IconCheck />,
    })
  }
  return res
}

type userEntity = {
  id: string,
  name: string,
  isRed: boolean,
}

export default function Configuration() {

  const [users, setUsers] = useState([])
  const [open, setOpen] = useState(false)
  const [isRed, setIsRed] = useState(false)


  useEffect(() => {
    getUsers().then(res => { setUsers(res) })
  }, [])

  const onComplete = () => {
    getUsers().then(res => { setUsers(res) })
  }


  return (
    <main className="bg-black flex max-h-[calc(100vh)] min-h-[calc(100vh)] flex-col justify-between">
      <div className="flex flex-col overflow-auto z-10" >
        <div className='flex bg-gray-500 p-6 fixed top-0 left-0 w-full'>
          <div className='flex-1  text-2xl'>Configuration</div>
          <Button color="gray" className='bg-gray-700 m-0 h-8' onClick={() => { setOpen(true); setIsRed(false) }}>Ajouter un joueur</Button>
        </div>
        <div className='min-h-max	 mt-20 mb-20' >
          <div className='flex flex-row p-4 items-center mb-4'>
            <h2 className='flex-1 text-xl '>Team <span className='text-blue-600 font-medium'>Blue</span></h2>
            <span className='mr-2'>( {users.filter((user: userEntity) => !user.isRed).length} )</span>
          </div>
          {users.filter((user: userEntity) => !user.isRed).map((user: userEntity) => {
            return (
              <div className='flex mr-6' key={user.id}>
                <div className='flex-grow ml-6 mb-6'>{user.name}</div>
                <IconX onClick={() => deleteUser(user.id).then(res => {
                  if (res.ok) {
                    onComplete()
                  }
                })} />
              </div>
            )
          })}
          <div className='flex flex-row p-4 items-center mb-4'>
            <h2 className='flex-1 text-xl '>Team <span className='text-red-600 font-medium'>Red</span></h2>
            <span className="mr-2" >( {users.filter((user: userEntity) => user.isRed).length} )</span>
          </div>
          <div className="flex flex-col justify-start">
            {users.filter((user: userEntity) => user.isRed).map((user: userEntity) => {
              return (
                <div className='flex mr-6' key={user.id}>
                  <div className='flex-grow ml-6 mb-6'>{user.name}</div>
                  <IconX onClick={() => deleteUser(user.id).then(res => {
                    if (res.ok) {
                      onComplete()
                    }
                  })} />
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <Dialog open={open} onClose={() => setOpen(false)} isRed={isRed} onComplete={() => onComplete()} />
    </main >
  )
}
