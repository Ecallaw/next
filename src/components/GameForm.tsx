'use client'

import { createGame } from "@/models/game";
import { Input, NumberInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from '@tabler/icons-react';

type Props = {
  open: boolean;
  onClose: any;
  onComplete: any;
};

export default function GameForm(props: Props) {
  const { open, onClose, onComplete } = props
  const handleClose = () => onClose();

  const handleCreateGame = async (e: any) => {
    e.preventDefault()
    console.log("name", e.target.name.value)
    console.log("nbPlayer", e.target.nbPlayer.value)
    console.log("duration", e.target.duration.value)
    if (e.target.name.value === "" || e.target.nbPlayer.value === "" || e.target.duration.value === "") {
      notifications.show({
        title: "Impossible de soumettre le formulaire",
        message: "Champs vide",
        color: 'red',
        icon: <IconX />,
      })
      return
    }
    const res = await createGame({ name: e.target.name.value, nbPlayer: e.target.nbPlayer.value, duration: e.target.duration.value })
    if (!res.ok) {
      notifications.show({
        title: "Impossible d'ajouter le jeu",
        message: res.error,
        color: 'red',
        icon: <IconX />,
      })
    } else {
      notifications.show({
        title: "Jeu enregistré avec succès",
        message: e.target.name.value + " a bien été ajouté.",
        color: 'green',
        icon: <IconCheck />,
      })
      e.target.name.value = ""
      e.target.nbPlayer.value = ""
      e.target.duration.value = ""
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
                Ajouter un jeu
              </h3>
              <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal" onClick={handleClose}>
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-8 space-y-6 ">
              <form onSubmit={handleCreateGame} id='addGameForm' >
                <div className="mb-6">
                  <Input.Wrapper id='name' label="Nom du jeu" mx="auto" styles={{ label: { color: 'white' } }}>
                    <Input
                      placeholder="Nom du jeu"
                      id='name'
                    />
                  </Input.Wrapper>
                </div>
                <div className="mb-6 w-48">
                  <Input.Wrapper id='nbPlayer' label="Nombre de joueur" mx="auto" styles={{ label: { color: 'white' } }}>
                    <NumberInput
                      placeholder="nb joueur max"
                      type='number'
                      id='nbPlayer'
                    />
                  </Input.Wrapper>
                </div>
                <div className="mb-6 w-48">
                  <Input.Wrapper id='duration' label="Durée du jeu (min)" mx="auto" styles={{ label: { color: 'white' } }}>
                    <NumberInput
                      placeholder="Durée max du jeu"
                      type='number'
                      id='duration'
                    />
                  </Input.Wrapper>
                </div>
              </form>
            </div>
            <div className="flex justify-end items-center p-8 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button data-modal-hide="defaultModal" form="addGameForm" type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Ajouter</button>
              <button data-modal-hide="defaultModal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600" onClick={handleClose}>Annuler</button>
            </div>
          </div>
        </div>
      </div >
    </div >
  )
}


