"use client"
import { getUsers } from '@/app/requests/user';
import { Drawer, Button, Group, Select, Input, NumberInput } from '@mantine/core';
import { EntryScore, Game, User } from '@prisma/client';

import { useEffect, useState } from 'react';

import { Inter } from 'next/font/google'
import { notifications } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';

const inter = Inter({ subsets: ['latin'] })


type Props = {
  opened: boolean;
  onClose: any;
  games: Game[];
};

export default function MatchForm(props: Props) {
  const { opened, onClose, games } = props
  const [users, setUsers] = useState([] as User[])
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [score, setScore] = useState([] as any[])
  const [dropdownUser, setDropdownUser] = useState<{ value: string, label: string }[]>([])

  useEffect(() => {
    getUsers().then(res => {
      if (!res.error) {
        setUsers(res)
        setDropdownUser(res.map((user: User) => {
          return {
            value: user.id,
            label: user.name
          }
        }))
      }
    })
  }, [])

  useEffect(() => {
    setScore([])
  }, [selectedGame])


  const handleChange = (e: String) => {
    const game: any = games.find(game => game.name === e)
    setSelectedGame(game)
  }

  const handleAddEntry = () => {
    if (selectedGame != null && score.length === selectedGame?.nbPlayer) {
      notifications.show({
        title: "Impossible d'ajouter un résultat",
        message: selectedGame.nbPlayer + " joueurs maximum !",
        color: 'red',
        icon: <IconX />,
      })
      return
    }
    score.push({ userId: '', score: '' })
    const newScore = [...score]
    setScore(newScore)
  }

  const resetData = () => {
    setSelectedGame(null);
    setScore([])
  }

  const createMatch = async (e: any) => {
    e.preventDefault()
    console.log("score", score)
    console.log("selected", selectedGame)
    const data = await fetch('/api/match', {
      method: "POST",
      body: JSON.stringify({ gameId: selectedGame.id, score: score })
    })
  }



  return (
    <Drawer
      className='bg-red-500'
      opened={opened}
      onClose={() => { onClose(); resetData() }}
      title="Enregister un partie"
      position='right'
      size="100%"
      styles={{ content: { backgroundColor: '#111' }, header: { backgroundColor: '#111', color: '#FFF' } }}>
      <form onSubmit={createMatch} id='addForm'>
        <Select
          styles={{ label: { color: 'white' } }}
          label="Jeu"
          placeholder="Choisissez un jeu"
          data={games.map((game: Game) => game.name)}
          onChange={(e: string) => handleChange(e)}
        />

        {selectedGame &&
          <div>
            <div className='flex mt-4 mb-2 border-gray-100 border-b-2 pb-2'>
              <h2 className='flex-1 mt-4 text-xl text-gray-200'>Score</h2>
              <div className='mt-4 w-40'>
                <Button
                  color="gray"
                  className='bg-gray-700 m-0 h-8'
                  styles={{ root: { width: '160px' } }}
                  onClick={() => handleAddEntry()}
                >
                  Ajouter un résultat
                </Button>
              </div>
            </div>
            {(score && users) &&
              <div>
                {score.map((entry, index) => {
                  return (
                    <div key={index} className='flex mb-2 items-center '>
                      <div className='mt-5 mr-4'>
                        <IconX color='white' size={'1.5rem'} onClick={() => {
                          score.splice(index, 1)
                          const newScore = [...score]
                          setScore(newScore)
                        }} />
                      </div>
                      <div className='flex-1 mr-4'>
                        <Select
                          styles={{ label: { color: 'white' } }}
                          label="Joueur"
                          placeholder="Choisissez un joueur"
                          data={dropdownUser}
                          value={score[index].userId}
                          onChange={(e) => {
                            score[index] = { ...score[index], userId: e }
                            const newScore = [...score]
                            setScore(newScore)
                          }}
                        />
                      </div>
                      <div className='w-40'>
                        <Input.Wrapper id='score' label="Score" mx="auto" styles={{ label: { color: 'white' } }}>
                          <NumberInput
                            placeholder="Entrer le score"
                            type='number'
                            id='score'
                            value={score[index].score}
                            onChange={(e) => {
                              score[index] = { ...score[index], score: e }
                              const newScore = [...score]
                              setScore(newScore)
                            }}
                          />
                        </Input.Wrapper>
                      </div>
                    </div>
                  )
                })
                }
              </div>
            }
            <div>
              {score.length === 0 && <div className='text-gray-200'>
                Aucun résultat ajouter</div>}
            </div>
            <div className='flex flex-1 justify-end mt-4 border-gray-200 border-t-2 pt-2'>
              <Button color="gray" className='bg-blue-700 m-0 h-8'
                type='submit'

                styles={{ root: { width: '160px' } }}
              >
                Valider le résultat
              </Button>
              {/* <button data-modal-hide="defaultModal" form="addForm" type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Valider les résultat</button> */}
            </div>
          </div>
        }
      </form>
    </Drawer >
  );
}