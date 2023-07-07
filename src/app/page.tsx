import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    // <main className="flex min-h-screen flex-col items-center justify-between p-24">
    <main>
        <h1 className="capitalize">Home page</h1>
        <Link href="/home">Coucou</Link>

    </main>
  )
}
