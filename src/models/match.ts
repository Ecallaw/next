
export const getMatchs = async (bodyValues: any) => {
  const {skip, take} = bodyValues
  const data = await fetch('/api/match/?'+ new URLSearchParams({
    skip,
    take,
  }), {
    method: "GET",
  })
  return await data.json()
}
