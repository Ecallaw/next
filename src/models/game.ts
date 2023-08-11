export const createGame = async (bodyValues: any) => {
  const { name, nbPlayer, duration } = bodyValues
  const data = await fetch('/api/game', {
    method: "POST",
    body: JSON.stringify({ name, nbPlayer, duration })
  })
  const res = await data.json()
  return res
}


export const createUser = async (bodyValues: any) => {
  const { name, isRed } = bodyValues
  const data = await fetch('/api/user', {
    method: "POST",
    body: JSON.stringify({ name, isRed })
  })
  const res = await data.json()
  return res
}

export const getGames = async () => {
  const data = await fetch('/api/game', {
    method: "GET",
  })
  return await data.json()
}
