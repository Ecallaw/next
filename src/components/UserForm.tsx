'use client'

import { createUser } from "@/models/user";
import { Switch, useMantineTheme } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconMeteor, IconMoonStars, IconX } from '@tabler/icons-react';
import { useState } from "react";

type Props = {
  open: boolean;
  isRed: boolean;
  onClose: any;
  onComplete: any;
};

const updateGame = async (id: string, name: string) => {
  const data = await fetch("/api/game/?"+ new URLSearchParams({
    id,
    name,
  }), {
    method: "UPDATE",
  })
  const res = await data.json();

  if (!res.ok) {
    notifications.show({
      title: "Impossible de supprimer le joueur",
      message: res.error,
      color: "red",
      icon: <IconX />,
    });
  } else {
    notifications.show({
      title: "Suppression réussite !",
      message: 'la partie a été supprimer',
      color: "green",
      icon: <IconCheck />,
    });
  }
}


export default function UserForm(props: Props) {
  const theme = useMantineTheme();

  const [checked, setChecked] = useState(false);
  const { open, onClose, isRed, onComplete } = props

  const handleClose = () => onClose();

  const handleCreateUser = async (e: any) => {
    e.preventDefault()
    if (e.target.username.value === '') {
      notifications.show({
        title: "Impossible de soumettre le formulaire",
        message: 'Nom vide',
        color: 'red',
        icon: <IconX />,
      })
      return
    }

    const res = await createUser({ name: e.target.username.value, isRed: checked })

    if (!res.ok) {
      notifications.show({
        title: "Impossible d'ajouter un joueur",
        message: res.error,
        color: 'red',
        icon: <IconX />,
      })
    } else {
      notifications.show({
        title: checked ? "Ajout équipe rouge réussi" : "Ajout équipe bleue réussi",
        message: e.target.username.value + " a bien été ajouté.",
        color: 'green',
        icon: <IconCheck />,
      })
      e.target.username.value = ""
      onClose();
      onComplete();
    }
  }



  return (
    <div className={open ? "absolute bottom-0 left-0 overflow-y-hidden z-50 w-full" : " absolute bottom-0 left-0 overflow-y-hidden z-0 w-full"}>
      <div id="defaultModal" tabIndex={-1} className={open ? "mb-0 w-full h-full translate-y-0 duration-300" : "translate-y-full duration-300"}>
        <div className="relative w-full max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-start justify-between p-6 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                { "Ajouter un joueur à l'équipe " + isRed ? 'rouge' : 'bleue'}
              </h3>
              <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal" onClick={handleClose}>
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-8 space-y-6">
              <form onSubmit={handleCreateUser} id='addForm'>
                <div className="mb-6">
                  <label className="block text-white text-sm font-semibold mb-2" htmlFor="username">
                    Nom du joueur
                  </label>
                  <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Nom du joueur" />
                </div>
                <label className="block text-white text-sm font-semibold" htmlFor="team">
                  Equipe
                </label>
                <Switch
                  className="mt-2"
                  size="xl"
                  id="team"
                  color={theme.colorScheme === 'dark' ? 'gray' : 'dark'}
                  onLabel={<IconMeteor size="1.5rem" stroke={2.5} color={theme.colors.red[6]} />}
                  offLabel={<IconMoonStars size="1.5rem" stroke={2.5} color={theme.colors.blue[6]} />}
                  checked={checked}
                  onChange={(event) => setChecked(event.currentTarget.checked)}
                />
              </form>
            </div>
            <div className="flex justify-end items-center p-8 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button data-modal-hide="defaultModal" form="addForm" type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Ajouter</button>
              <button data-modal-hide="defaultModal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600" onClick={handleClose}>Annuler</button>
            </div>
          </div>
        </div>
      </div >
    </div >
  )
}


