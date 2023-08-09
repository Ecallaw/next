'use client'

import { useState } from "react"

export default function AddTeamate() {

  const [open, setOpen] = useState(true)

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault()
    const data = await fetch('/api/createUser', {
      method: "POST",
      body: JSON.stringify({ name: "julien" })
    })
    const res = await data.json()
    if (!res.ok) {
      console.log(res.error)
    }
  }

  return (
    <div className='flex flex-col'>
      <div className='flex flex-row p-6 items-center'>
        <h2 className='flex-1 text-xl '>Team <span className='text-blue-600 font-medium'>Bleue</span></h2>
        <form onSubmit={createUser}>
          <button
            type="submit"
            onClick={() => setOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 hover:text-blue-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </form>
      </div>

    </div>
  )
}


