export const getScores = async () => {
  const data = await fetch('/api/score', {
    method: "GET",
  })
  return await data.json()
}
