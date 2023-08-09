"use client"
import { useMantineTheme } from '@mantine/core';
import { IconMeteor, IconMoonStars } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Button } from '@mantine/core';
import MatchForm from '@/components/MatchForm';
import { useDisclosure } from '@mantine/hooks';
import { createGame, getGames } from './requests/game';

type gameEntity = {
  id: string,
  name: string,
}

export default function Event() {
  const [games, setGames] = useState([])
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();

  useEffect(() => {
    getGames().then(res => { setGames(res) })
  }, [])

  return (
    <main>
      <div className='bg-gray-500 p-6 text-2xl fixed top-0 left-0 w-full z-50'>Event</div>
      <div className=''>
        <div className='relative flex mt-20' >
          <div className='flex-1 h-60 border-white border-r-2 border-b-2'>
            <h2 className='text-center text-xl mt-10 mb-2 text-blue-500 font-bold'>TEAM BLUE</h2>
            <div className='flex-1 text-4xl text-center font-extrabold mb-2'>140 pts</div>
            <div className='flex justify-items-center'>
              <IconMoonStars className="flex-1" size="5.2rem" stroke={2} color={theme.colors.blue[9]} />
            </div>
          </div>
          <div className='flex-1 h-60 border-white border-l-2 border-b-2'>
            <h2 className='text-center text-xl mt-10 mb-2 text-red-500 font-bold'>TEAM RED</h2>
            <div className='flex-1 text-4xl text-center font-extrabold mb-2'>90 pts</div>
            <div className='flex justify-items-center'>
              <IconMeteor className="flex-1" size="5.2rem" stroke={2} color={theme.colors.red[7]} />
            </div>
          </div>
        </div>
        <div className='relative'>
          <button
            className="absolute -top-10 border-white	border-2	-500/50 left-1/2 -translate-x-1/2 p-0 w-20 h-20 bg-gray-600 rounded-full hover:bg-gray-700 active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none"
            onClick={open}>
            <svg viewBox="0 0 20 20" enableBackground="new 0 0 20 20" className="w-8 h-8 inline-block">
              <path fill="#FFFFFF" d="M16,10c0,0.553-0.048,1-0.601,1H11v4.399C11,15.951,10.553,16,10,16c-0.553,0-1-0.049-1-0.601V11H4.601C4.049,11,4,10.553,4,10c0-0.553,0.049-1,0.601-1H9V4.601C9,4.048,9.447,4,10,4c0.553,0,1,0.048,1,0.601V9h4.399C15.952,9,16,9.447,16,10z" />
            </svg>
          </button>
        </div>
        <div className='flex-1 mx-4 mt-20'>
          <div className='pb-2 text-2xl mb-2 font-semibold border-gray-100 border-b-2'>Derniers jeux</div>
          <div>Liste des jeux</div>
          <Button color="gray" className='bg-gray-700 m-0 h-8' onClick={() => {
            createGame().then((res) => {
              if (res.ok) {
                getGames().then(res => { setGames(res) })
              }
            })
          }}>Ajouter un Jeux</Button>
          {games && games.map((game: gameEntity) => {
            return (
              <div key={game.id} className="mt-4">{game.name}</div>
            )
          })}
        </div>
        <div className='flex-1 mx-4 mt-20'>
          <div className='pb-2 text-2xl mb-2 font-semibold border-gray-100 border-b-2'>Dernières parties jouées</div>
          <div>Liste des parties</div>
          <Button color="gray" className='bg-gray-700 m-0 h-8' onClick={() => {
            createGame().then((res) => {
              if (res.ok) {
                getGames().then(res => { setGames(res) })
              }
            })
          }}>Ajouter un partie</Button>
        </div>
        <div className='flex-1 mx-4 mt-20'>
          <div className='pb-2 text-2xl mb-2 font-semibold border-gray-100 border-b-2'>Dernier scores</div>
          <div>Liste des scores</div>
        </div>
      </div>
      <MatchForm opened={opened} onClose={close} games={games} />
    </main >
  )
}
