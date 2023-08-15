
export const getResults = async () => {
  const data = await fetch('/api/result', {
    method: "GET",
  })
  return await data.json()
}