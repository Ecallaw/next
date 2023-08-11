
export const createUser = async (bodyValues: any) => {
  const { name, isRed } = bodyValues
  const data = await fetch('/api/user', {
    method: "POST",
    body: JSON.stringify({ name, isRed })
  })
  const res = await data.json()
  return res
}

export const getUsers = async () => {
  const data = await fetch('/api/user', {
    method: "GET",
  })
  return await data.json()
}