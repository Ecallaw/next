"use client"
import { Pagination, useMantineTheme } from '@mantine/core';
import { IconCheck, IconMeteor, IconMoonStars } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import MatchForm from '@/components/MatchForm';
import { useDisclosure } from '@mantine/hooks';
import GameItem from '@/components/GameItem';
import { getMatchs } from '@/models/match';
import { getScores } from '@/models/score';
import { getBlueTotal, getRedTotal } from '@/utils/misc';
import { IconX } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import AdminDeleteMatch from '@/components/AdminDeleteMatch';


const deleteMatch = async (id: number) => {
  const data = await fetch("/api/match/" + id, {
    method: "DELETE",
  });
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
  return res;
};

export default function Event() {
  const [matchs, setMatchs] = useState([])
  const [count, setCount] = useState(0)
  const [totalBlue, setTotalBlue] = useState(0)
  const [totalRed, setTotalRed] = useState(0)
  const [opened, { open, close }] = useDisclosure(false);
  const [activePage, setPage] = useState(1);
  const [visible, setVisibility] = useState(false);
  const [matchId, setMatchId] = useState<number>(-1);
  const theme = useMantineTheme();


  useEffect(() => {
    getMatchs({skip : 0, take: 5}).then(res => {setMatchs(res.matchs); setCount(res.count) })
    getScores().then((res) => {
      if (!res.error) {
        setTotalBlue(getBlueTotal(res) / 10)
        setTotalRed(getRedTotal(res) / 10)
      }
    })
  }, [])

  useEffect(() => {
    const skip = (activePage-1)*5
    const take = count - skip > 5 ? 5 : count - skip
    getMatchs({skip , take}).then(res => {setMatchs(res.matchs); setCount(res.count) })
  }, [activePage])

  const onComplete = () => {
    getMatchs({skip : 0, take: 5}).then(res => {setMatchs(res.matchs); setCount(res.count) })
    getScores().then((res) => {
      if (!res.error) {
        setTotalBlue(getBlueTotal(res) / 10)
        setTotalRed(getRedTotal(res) / 10)
      }
    })
  }

  const handleRefresh = () => {
    getMatchs({skip : 0, take: 5}).then(res => {setMatchs(res.matchs); setCount(res.count) })
    getScores().then((res) => {
      if (!res.error) {
        setTotalBlue(getBlueTotal(res) / 10)
        setTotalRed(getRedTotal(res) / 10)
      }
    })
  }
  
  return (
    <main className='bg-black flex max-h-[calc(100vh)] min-h-[calc(100vh)] flex-col justify-between'>
      <div className='overflow-auto mb-24 z-50'>
        <div className=' bg-gray-500 p-6 text-2xl fixed top-0 left-0 w-full z-50'>Event</div>
        <div className='min-h-max relative flex mt-20' >
          <div className='flex-1 h-60 border-white border-r-2 border-b-2'>
            <h2 className='text-center text-xl mt-10 mb-2 text-blue-500 font-bold'>TEAM BLUE</h2>
            <h2 className='text-center text-4xl mt-5 mb-2 text-gray-200 font-bold'>{totalBlue}</h2>
            <div className='flex justify-items-center'>
              <IconMoonStars className="flex-1" size="5.2rem" stroke={2} color={theme.colors.blue[9]} />
            </div>
          </div>
          <div className='flex-1 h-60 border-white border-l-2 border-b-2'>
            <h2 className='text-center text-xl mt-10 mb-2 text-red-500 font-bold'>TEAM RED</h2>
            <h2 className='text-center text-4xl mt-5 mb-2 text-gray-200 font-bold'>{totalRed}</h2>
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
                <GameItem game={match.game} scores={match.scores} createdAt={match.createdAt} onDelete={()=> {setMatchId(match.id); setVisibility(true)}}/>
              </div>
            )
          })}
        </div>
        {matchs && <div className='flex flex-1 mt-4 justify-center h-10'>
          <Pagination  styles={(theme) => ({
            control: {
              color: "#FFF",
              '&[data-active]': {
                backgroundImage: theme.fn.gradient({ from: 'blue', to: 'gray' }),
                border: 0,
              },
              '&:hover': {
                cursor: 'pointer',
                backgroundColor: "#6b7280 !important",
              },
            },
          })} value={activePage} color='gray' onChange={setPage} total={Math.ceil(count/5)} />
        </div>}
      </div>
      <MatchForm opened={opened} onClose={close}  onComplete={() => onComplete()} />
      <AdminDeleteMatch open={visible} onClose={() => setVisibility(false)} onDeleteMatch={()=> deleteMatch(matchId).then(res => {handleRefresh()})} />
    </main >
  )
}
