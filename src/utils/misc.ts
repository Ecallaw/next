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
  const totalBlue = scores.filter((entry: any) => !entry.user.isRed).reduce((acc: any, val: any) => acc + val.result, 0)
  const totalRed = scores.filter((entry: any) => entry.user.isRed).reduce((acc: any, val: any) => acc + val.result, 0)

  if (totalBlue > totalRed) {
    return { value: totalBlue - totalRed, colorAtt: 'text-blue-500' }
  }

  if (totalRed > totalBlue) {
    return { value: totalRed - totalBlue, colorAtt: 'text-red-500' }
  }

  return { value: 0, colorAtt: 'text-gray-200' }
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