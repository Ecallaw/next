
export const getResults = async () => {
  const data = await fetch('/api/result', {
    method: "GET",
    next: { revalidate: 2 }
  },)
  return await data.json()
}

// export const getResults = async () => {
//   const data = await fetch('/api/result', {
//     method: "GET",
//     headers: {
//       'Content-Type': 'application/json',
//       'API-Key': process.env.DATA_API_KEY,
//     },
//   },)
//   return await data.json()
// }