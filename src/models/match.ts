
export const createMatch = async () => {
  const data = await fetch('/api/match', {
    method: "POST",
    body: JSON.stringify({ name: "Azul", nbPlayer: 4, duration: 90 })
  })
  const res = await data.json()
  return res
}

export const getMatchs = async () => {
  const data = await fetch('/api/match', {
    method: "GET",
  })
  return await data.json()
}
