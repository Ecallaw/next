"use client"
import { useMantineTheme } from '@mantine/core';
import { IconMeteor, IconMoonStars } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import MatchForm from '@/components/MatchForm';
import { useDisclosure } from '@mantine/hooks';
import { Match } from '@prisma/client';
import GameItem from '@/components/GameItem';
import { getMatchs } from '@/models/match';
import { getScores } from '@/models/score';
import { getBlueTotal, getRedTotal } from '@/utils/misc';

export default function Event() {
  const [matchs, setMatchs] = useState([])
  const [totalBlue, setTotalBlue] = useState(0)
  const [totalRed, setTotalRed] = useState(0)
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();

  useEffect(() => {
    getMatchs().then(res => { setMatchs(res) })
    getScores().then((res) => {
      if (!res.error) {
        setTotalBlue(getBlueTotal(res) / 10)
        setTotalRed(getRedTotal(res) / 10)
      }
    })
  }, [])

  const onComplete = () => {
    getMatchs().then(res => { setMatchs(res) })
    getScores().then((res) => {
      if (!res.error) {
        setTotalBlue(getBlueTotal(res) / 10)
        setTotalRed(getRedTotal(res) / 10)
      }
    })
  }

  return (
    <main className='bg-black flex max-h-[calc(100vh)] min-h-[calc(100vh)] flex-col justify-between'>
      <div className='overflow-auto mb-20'>
        <div className=' bg-gray-500 p-6 text-2xl fixed top-0 left-0 w-full z-50'>Event</div>
        <div className='min-h-max relative flex mt-20' >
          <div className='flex-1 h-60 border-white border-r-2 border-b-2'>
            <h2 className='text-center text-xl mt-10 mb-2 text-blue-500 font-bold'>TEAM BLUE</h2>
            <div className='flex-1 text-4xl text-center font-extrabold mb-2'>{totalBlue} pts</div>
            <div className='flex justify-items-center'>
              <IconMoonStars className="flex-1" size="5.2rem" stroke={2} color={theme.colors.blue[9]} />
            </div>
          </div>
          <div className='flex-1 h-60 border-white border-l-2 border-b-2'>
            <h2 className='text-center text-xl mt-10 mb-2 text-red-500 font-bold'>TEAM RED</h2>
            <div className='flex-1 text-4xl text-center font-extrabold mb-2'>{totalRed} pts</div>
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
        <div className='flex-1 mx-4 mt-10'>
          {/* <div className='pb-2 text-2xl mb-2 font-semibold border-gray-100 border-b-2'>Résulats</div> */}
          {matchs && matchs.map((match: any) => {
            return (
              <div key={match.id}>
                <GameItem game={match.game} scores={match.scores} createdAt={match.createdAt} />
              </div>
            )
          })}
        </div>
      </div>
      <MatchForm opened={opened} onClose={close} onComplete={() => onComplete()} />
    </main >
  )
}
