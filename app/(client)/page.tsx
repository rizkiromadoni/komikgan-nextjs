import { auth } from '@/auth'
import React from 'react'

const HomePage = async () => {
  const session = await auth()

  return (
    <div>{session?.user?.email}</div>
  )
}

export default HomePage