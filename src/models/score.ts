export const getScores = async () => {
  const data = await fetch('/api/score', {
    method: "GET",
    next: { revalidate: 2 }
  })
  return await data.json()
}
