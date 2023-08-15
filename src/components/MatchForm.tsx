"use client"
import { Drawer, Button, Group, Select, Input, NumberInput, Collapse, LoadingOverlay } from '@mantine/core';
import { Game, User } from '@prisma/client';

import { useEffect, useState } from 'react';

import { notifications } from '@mantine/notifications';
import { IconCheck, IconDeviceGamepad, IconX } from '@tabler/icons-react';
import { getUsers } from '@/models/user';
import { getDate } from '@/utils/misc';
import { getGames } from '@/models/game';
import GameForm from './GameForm';
import { MdMoreVert } from 'react-icons/md';
import UpdateGameForm from './UpdateGameForm';

type Props = {
  opened: boolean;
  onClose: any;
  onComplete: any;
};


const updateGame = async (id: string, name: string) => {

  const data = await fetch("/api/game/" + id , {
    method: "PUT",
    body: JSON.stringify({ name })
  })
  const res = await data.json();

  
  if (!res.ok) {
    notifications.show({
      title: "Impossible de modifier le jeu",
      message: res.error,
      color: "red",
      icon: <IconX />,
    });
  } else {
    notifications.show({
      title: "Mise à jours réussite !",
      message: 'le jeu a été renommé',
      color: "green",
      icon: <IconCheck />,
    });
  }
  return res
}


export default function MatchForm(props: Props) {
  const { opened, onClose, onComplete } = props
  const [users, setUsers] = useState([] as User[])
  const [games, setGames] = useState<Game[]>([])
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [openGameForm, setOpenGameForm] = useState(false)
  const [onCollapse, setOnCollapse] = useState(true)
  const [openUpdateGameForm, setOpenUpdateGameForm] = useState(false)
  const [currentName, setCurrentName] = useState('')
  const [currentId, setCurrentId] = useState('')
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
    getGames().then((res : any) => { setGames(res) })
  }, [])

  useEffect(() => {
    setScore([])
  }, [selectedGame])

  useEffect(() => {
    setOnCollapse(score.length === 0)
  }, [score])


  const handleChange = (e: String) => {
    const game = games.find((game: Game) => game.name === e)
    setSelectedGame(game as Game)
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
    score.push({ userId: '', score: '', result: '' })
    const newScore = [...score]
    setScore(newScore)
  }

  const resetData = () => {
    setSelectedGame(null);
    setScore([])
  }

  const createMatch = async (e: any) => {
    e.preventDefault()
    if (score.length === 0) {
      notifications.show({
        title: "Impossible de soumettre les résultats",
        message: "Score vide",
        color: 'red',
        icon: <IconX />,
      })
    }

    const isEmptyError = score.reduce((acc, val) => {
      if (acc) { return acc }
      return acc === acc && (val.userId === '' || val.score === '')
    }, false)

    if (isEmptyError) {
      notifications.show({
        title: "Impossible de soumettre les résultats",
        message: "Champs vide",
        color: 'red',
        icon: <IconX />,
      })
      return
    }

    const idsArr = score.map(entry => entry.userId)
    const sameValueError = idsArr.some(x => idsArr.indexOf(x) !== idsArr.lastIndexOf(x))

    if (sameValueError) {
      notifications.show({
        title: "Impossible de soumettre les résultats",
        message: "Joueur présent plusieurs fois",
        color: 'red',
        icon: <IconX />,
      })
      return
    }


    if (selectedGame !== null) {
      const data = await fetch('/api/match', {
        method: "POST",
        body: JSON.stringify({ gameId: selectedGame.id, scores: score })
      })

      const res = await data.json()
      if (!res.ok) {
        notifications.show({
          title: "Impossible d'enregistrer la partie",
          message: res.error,
          color: 'red',
          icon: <IconX />,
        })
      } else {
        notifications.show({
          title: "Partie enregistrée avec succes",
          message: "La partie " + selectedGame.name + " a bien été enregistrée",
          color: 'green',
          icon: <IconCheck />,
        })
        onClose();
        onComplete();
        resetData();
      }
    }
  }

  const onAddedGame = () => {
    getGames().then(res => { setGames(res) })
  }

  const onUpdateGame = (id: string, name: string) => {
    updateGame(id, name).then((res: any) => {
      if(!res.error){
        getGames().then(res => { setGames(res) })
      }
    })
  }

  return (
    <Drawer
      opened={opened}
      onClose={() => { onClose(); resetData() }}
      title="Enregister un partie"
      position='right'
      size="100%"
      styles={{ content: { backgroundColor: '#111' }, header: { backgroundColor: '#111', color: '#FFF', fontSize: 50 }, title: { color: '#FFF', fontSize: "1.3rem" } }}>
      <div className='relative z-10'>
        <div className='flex mt-4 mb-4 border-gray-100 border-b-2 pb-2'>
          <h2 className='flex-1 mt-4 text-xl text-gray-200'>Créer un partie</h2>
        </div>
        <form onSubmit={createMatch} id='addForm' >
          {games.length !== 0 && <Select
            styles={{ label: { color: 'white' } }}
            label="Jeu"
            placeholder="Choisissez un jeu"
            data={games.map((game: Game) => game.name)}
            onChange={(e: string) => handleChange(e)}
          />}

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
                  Aucun résultat ajouté</div>}
              </div>
              <div className='flex flex-1 justify-end mt-4 border-gray-200 border-t-2 pt-2'>
                <Button color="gray" className='bg-blue-700 m-0 h-8'
                  type='submit'
                  styles={{ root: { width: '160px' } }}
                >
                  Valider le résultat
                </Button>
              </div>
            </div>
          }
        </form>
        <Collapse in={onCollapse}>
          <div className='flex-1 mt-20'>
            <div className='flex mt-4 mb-4 border-gray-100 border-b-2 pb-2'>
              <h2 className='flex-1 mt-4 text-xl text-gray-200'>Liste des jeux</h2>
              <div className='mt-4 w-40'>
                <Button
                  color="gray"
                  className='bg-gray-700 m-0 h-8'
                  styles={{ root: { width: '160px' } }}
                  onClick={() => setOpenGameForm(true)}
                >
                  Ajouter un jeu
                </Button>
              </div>
            </div>

            {games && games.map((game: Game) => {
              return (
                <div key={game.id} className='flex text-gray-200 mb-4'>
                  <div className='w-20 h-20 bg-gray-800 flex items-center justify-center' >
                    <IconDeviceGamepad size='2rem' />
                  </div>
                  <div className='flex-1 flex items-center'>
                    <div className='flex-1 flex-col'>
                      <div className='text-2xl text-gray-200 pl-4'>{game.name}</div>
                      <div className='text-sm text-gray-200 pl-4'>{getDate(game.createdAt)}</div>
                    </div>
                    <div className='flex-col'>
                      <div className='flex-1 text-2xl text-gray-200 pr-4 '>{game.nbPlayer + ' Joueurs'}</div>
                      <div className={'flex-1 text-sm text-right pr-4'}>{'Durée ' + game.duration + " min"}</div>
                    </div>
                    <MdMoreVert onClick={() => {setCurrentId(game.id+'');setCurrentName(game.name); setOpenUpdateGameForm(true);} }/>
                  </div>
                </div>
              )
            })}
          </div >
        </Collapse >
      </div>

      <UpdateGameForm open={openUpdateGameForm} onClose={() => setOpenUpdateGameForm(false)} onUpdateGame={(name: string) => onUpdateGame(currentId, name)} name={currentName}/>
      <GameForm open={openGameForm} onClose={() => setOpenGameForm(false)} onComplete={() => onAddedGame()} games={games} />
    </Drawer >
  );
}