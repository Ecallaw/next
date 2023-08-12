'use client'

import { createUser } from "@/models/user";
import { Button, Input, Switch, useMantineTheme } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconMeteor, IconMoonStars, IconX } from '@tabler/icons-react';
import { useState } from "react";
import { BiCheckShield, BiShieldX } from "react-icons/bi";
import { MdGroupRemove } from "react-icons/md";

type Props = {
  open: boolean;
  onClose: any;
  disabledRemove : boolean
  onRemove : any
};

const pwd = "Admin!"

export default function AdminPanel(props: Props) {

  const [visibility, setVisibility] = useState(false)
  
  const deleteAllData = async () => {
    const data = await fetch('/api/user/', {
      method: "DELETE",
    })
    const resUser = await data.json()

    const dataScore = await fetch('/api/score/', {
      method: "DELETE",
    })
    const resScore = await dataScore.json()

    const dataMatch = await fetch('/api/match/', {
      method: "DELETE",
    })
    const resMatch = await dataMatch.json()

    const dataGame = await fetch('/api/game/', {
      method: "DELETE",
    })
    const resGame = await dataGame.json()

    if (!resUser.error && !resScore.error && !resMatch.error && !resGame.error) {
      notifications.show({
        title: "Suppression réussite !",
        message: "toutes les données ont été supprimer",
        color: 'green',
        icon: <IconCheck />,
      })
    } else {
      notifications.show({
        title: "drop failed",
        message: "drop failed",
        color: 'red',
        icon: <IconX />,
      })
    }
  }

  const { open, onClose, disabledRemove, onRemove} = props

  const handleClose = () => {onClose(); setVisibility(false)};

  const handlePwd = (e: any) => {
    e.preventDefault()
    if(e.target.pwd.value === pwd){
      setVisibility(true)
    }else{
      notifications.show({
        title: "Mot de passe incorrect",
        message: "Tu n'as rien n'a faire ici coquin",
        color: 'red',
        icon: <IconX />,
      })
    }
    e.target.pwd.value = ''
  } 

  return (
    <div className={open ? "absolute bottom-0 left-0 overflow-y-hidden z-50 w-full" : " absolute bottom-0 left-0 overflow-y-hidden z-0 w-full"}>
      <div id="defaultModal" tabIndex={-1} className={open ? "mb-0 w-full h-full translate-y-0 duration-300" : "translate-y-full duration-300"}>
        <div className="relative w-full max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-start justify-between p-6 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                { "Administration" }
              </h3>
              <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal" onClick={handleClose}>
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <form onSubmit={handlePwd} id='pwForm'>
              <div className="flex items-center px-8 pt-4 pb-4">
                <div className="flex-1 mr-4">
                  <Input.Wrapper id='pwd' label="Password" mx="auto" styles={{ label: { color: 'white' } }}>
                    <Input type='password' placeholder="Password" id='pwd'/>
                  </Input.Wrapper>
                </div>
                <div>
                  <Button type='submit' variant="filled" className='mt-6 bg-gray-700 m-0 h-10 mr-4' >Mot de passe</Button>
                </div>
              </div>
            </form>
            {visibility && 
            <div>
              <div className="px-4 pt-4 ">
                <Button leftIcon={<MdGroupRemove size="1.5rem"/>} color="gray" className='bg-gray-700 m-0 h-8 mr-4' onClick={() => deleteAllData()}>Reset dataBase</Button>
              </div>
              <div className="px-4 py-4">
                <Button leftIcon={disabledRemove ? <BiShieldX size="1.5rem" /> : <BiCheckShield size="1.5rem" />} color="gray" className='bg-gray-700 m-0 h-8 mr-4' onClick={() => onRemove(!disabledRemove)}>Enable remove user</Button>
              </div>
            </div>}
            <div className="flex justify-end items-center p-8 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button data-modal-hide="defaultModal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600" onClick={handleClose}>Fermer</button>
            </div>
          </div>
        </div>
      </div >
    </div >
  )
}


