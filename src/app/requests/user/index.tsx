
export const getUsers = async () => {
  const data = await fetch('/api/user', {
    method: "GET",
  })
  return await data.json()
}