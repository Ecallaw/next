'use client'

import { compare } from "@/utils/misc";
import { useEffect, useState } from "react";
import { PiMedalFill } from "react-icons/pi";
import { getResults } from "@/models/result";




const medalListIcons = [
  <PiMedalFill key='gold' color='yellow' size="2rem" />,
  <PiMedalFill key='silver'color='grey' size="2rem"/>,
  <PiMedalFill key='bronze'color='brown' size="2rem"/>,
]

export default function Result() {
  const [countUser, setCountUser] = useState(0)
  const [countMatch, setCountMatch] = useState(0)
  const [matchs, setMatchs] = useState([])
  const [userScores, setUserScores] = useState([])
  
  useEffect(() => {
    getResults().then((res) => {
      if(!res.error){
        setCountUser(res.countUser)
        setCountMatch(res.countMatch)
        setMatchs(res.matchs)
        setUserScores(res.userScores)
      }
    })
  }, [])

  // const countUser = await prisma.user.count()
  // const countMatch = await prisma.match.count()
  // const matchs  = await prisma.match.findMany({
  //   include: {
  //     game: true,
  //     scores: {
  //       include: { user: true }
  //     },
  //   },
  // });


  console.log("scores", userScores)
  const minutePlayed = matchs.map((match : any) => match.game?.duration).reduce((acc:any, val: any) => {
    return acc + val
  }, 0)

  const hours = Math.floor(minutePlayed/60)
  const minutes = minutePlayed%60

  // const userScores  = await prisma.user.findMany({
  //   include: {
  //     scores: {
  //       select : { result: true, matchId: true }
  //     },
  //   },
  // }); 

  // const matchScore  = await prisma.match.findMany({
  //   include: {
  //     game: {
  //       select: {duration :true}
  //     },
  //     scores: {
  //       include: { user: {
  //         select : {name :true}
  //       } }
  //     },
  //   },
  // });

  const results = userScores.map((user: any) => {
    return {
      ...user,
      scores : user.scores.map((score: any) => score.result).reduce((acc :any, val:any) => acc + val, 0),
      nbGame : user.scores.length
    }
  })

  console.log("result", results)

  const classment = results.map((user : any) => {
    return {
      name : user.name,
      isRed : user.isRed,
      score : user.scores,
      nbGame : user.nbGame
    }
  }).sort(compare)



  // console.log("userScore", userScores[0].scores)
  // console.log("userScore", userScores[0].scores.map(score => score.result).reduce((acc :any, val:any) => acc + val, 0))


  
  return (
    <main className='bg-black flex max-h-[calc(100vh)] min-h-[calc(100vh)] flex-col justify-between'>
      <div className='overflow-auto mb-24 p-4'>
        <div className=' bg-gray-500 p-6 text-2xl fixed top-0 left-0 w-full z-50'>Résultats</div>
        <div className='flex mt-20'>
          <a href="#" className="flex-1 mr-2 block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Nombre de joueurs</h5>
            <p className="font-normal text-8xl  text-gray-700 dark:text-gray-400">{countUser}</p>
          </a>
          <a href="#" className="flex-1 ml-2 block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Nombre de parties</h5>
            <p className="font-normal text-8xl text-gray-700 dark:text-gray-400">{countMatch}</p>
          </a>
        </div>
        <div className="text-2xl mt-20 text-gray-200">Temps total passée aux activitées ludiques !</div>
        <div className="text-6xl mt-8 text-gray-200">{hours + "h " + minutes + "min"}</div>
        <div className="mt-20 flex-col">
          <div className="text-gray-200 text-2xl border-b-2 border-gray-200 pb-2">Classement des joueurs</div>
          <div className="p-4">
            {classment.map((user : any, index: number ) => {
              return(
                <div key={user.name + index} className='flex mt-2 '>
                  <div className='mt-1 pl-2 pr-3 border-b-2 border-gray-800'>
                    {index < medalListIcons.length ? medalListIcons[index] : <div className='pl-8' />}
                  </div>
                  <div className='w-12 pb-4 border-b-2 border-gray-800 text-md mt-2 text-gray-200 text-xl'>
                    {user.score}
                  </div>
                  <div className='w-12 pb-4 border-b-2 border-gray-800 text-md mt-2 text-gray-200 text-xl'>
                    {(user.score / user.nbGame).toFixed(1)}
                  </div>
                  <div className='w-12 pb-4 border-b-2 border-gray-800 text-md mt-2 text-gray-200 text-xl'>
                    {user.nbGame}
                  </div>
                  <div className={user.isRed ? "flex-1 mt-2 text-red-400 pb-2 border-b-2 border-gray-800 text-xl" : " mt-2 flex-1 text-blue-400 pb-2 border-b-2 border-gray-800 text-xl"}>
                    {user.name}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      
    </main>
  )
}
