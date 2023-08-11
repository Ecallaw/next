"use client"
import { Collapse } from '@mantine/core';
import { EntryScore, Game } from '@prisma/client';
import { useDisclosure } from '@mantine/hooks';
import { IconDeviceGamepad } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { compare, getDate, getDelta } from '@/utils/misc';
import { PiMedalFill, PiMedalLight } from 'react-icons/pi/';


type Props = {
  game: Game;
  scores: any;
  createdAt: Date;
};

const medalListIcons = [
  <PiMedalFill color='yellow' />,
  <PiMedalFill color='grey' />,
  <PiMedalFill color='brown' />,
]

export default function GameItem(props: Props) {
  const { game, scores, createdAt } = props
  const [opened, { open, close }] = useDisclosure(false);
  useEffect(() => {
    open()
  }, [])

  scores.sort(compare);

  const delta = getDelta(scores as any)


  return (
    <div className='py-2'>
      <div className='flex' onClick={opened ? close : open}>
        <div className={scores[0].user.isRed ? 'w-20 h-20 bg-red-500 flex items-center justify-center' : 'w-20 h-20 bg-blue-500 flex items-center justify-center'} >
          <IconDeviceGamepad size='2rem' />
        </div>
        <div className='flex-1 flex items-center'>
          <div className='flex-1 flex-col'>
            <div className='text-2xl text-gray-200 pl-4'>{game.name}</div>
            <div className='text-sm text-gray-200 pl-4'>{getDate(createdAt)}</div>
          </div>
          <div className='flex-col'>
            <div className='flex-1 text-2xl text-gray-200 pr-4 '>{scores.length + "/" + game.nbPlayer + ' Joueurs'}</div>
            <div className={' flex-1 text-sm text-right pr-4'}>Durée {game.duration} min</div>
          </div>
        </div>
      </div>
      <Collapse in={opened}>
        <div className={"flex ml-24 pb-2 mr-4 mt-4 flex-1 text-gray-100 pb-2 border-b-2 border-gray-800"}>
          <div className='flex-1'>résultats</div>
          <div className={delta.colorAtt + ' mt-1 text-sm text-right'}>+{delta.value + " (" + (delta.value * game.duration) / 10 + ' pts)'}</div>
        </div>

        {scores.map((entry: any, index: any) => {
          return (
            <div key={entry.id} className='flex ml-24 mt-2 '>
              <div className='mt-1 pl-2 pr-3 border-b-2 border-gray-800'>
                {index < medalListIcons.length ? medalListIcons[index] : <div className='pl-4' />}
              </div>
              <div className='pr-4 border-b-2 border-gray-800 text-md text-gray-400'>
                {'+' + (scores.length - index)}
              </div>
              <div className='w-16 pr-4 border-b-2 border-gray-800 text-md text-gray-400'>
                {((scores.length - index) * game.duration) / 10 + 'pts'}
              </div>
              <div className={entry.user.isRed ? "flex-1 text-red-400 pb-2 border-b-2 border-gray-800" : "flex-1 text-blue-400 pb-2 border-b-2 border-gray-800"}>
                {entry.user.name}
              </div>
              <div className='mr-4 pb-2 border-b-2 border-gray-800'>
                {entry.score}
              </div>
            </div>
          )
        })}
      </Collapse >
    </ div >
  );
}