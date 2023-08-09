
export const createGame = async () => {
  const data = await fetch('/api/game', {
    method: "POST",
    body: JSON.stringify({ name: "Azul", nbPlayer: 4, duration: 90 })
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
