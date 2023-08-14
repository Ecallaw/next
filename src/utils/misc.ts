import { EntryScore } from "@prisma/client";

export function compare(a: any, b: any) {
  if (b.score < a.score) {
    return -1;
  }
  if (b.score > a.score) {
    return 1;
  }
  return 0;
}

export const getDate = (date: Date) => {
  const dt = new Date(date);
  const padL = (nr: any, len = 2, chr = `0`) => `${nr}`.padStart(2, chr);

  return `${padL(dt.getMonth() + 1)}/${padL(dt.getDate())}/${dt.getFullYear()} ${padL(dt.getHours())}:${padL(dt.getMinutes())}:${padL(dt.getSeconds())}`
}

export const getDelta = (scores: any) => {
  const delta = scores.reduce((acc:any, val:any) => {
    const value = val.user.isRed ? -val.result : val.result
    return acc + value
  }, 0)

  if(delta < 0){
    return { value: Math.abs(delta), colorAtt: 'text-red-500', bgAtt: 'bg-red-500' } 
  }

  if(delta > 0) {
    return { value: Math.abs(delta), colorAtt: 'text-blue-500', bgAtt: 'bg-blue-500' } 
  }

  return { value: 0, colorAtt: 'text-gray-500', bgAtt: 'bg-gray-500' }
}

type getBlueTotal = (score: EntryScore) => number;
type getRedTotal = (score: EntryScore) => number;

export const getBlueTotal = (score: EntryScore[]) => {
  const blueResult = score.filter((entry: any) => !entry.user.isRed)

  return blueResult.reduce((acc: any, val: any) => {
    return acc + (val.result * val.match.game.duration)
  }, 0)
}

export const getRedTotal = (score: EntryScore[]) => {
  const redResult = score.filter((entry: any) => entry.user.isRed)

  return redResult.reduce((acc : any, val: any) => {
    return acc + (val.result * val.match.game.duration)
  }, 0)
}