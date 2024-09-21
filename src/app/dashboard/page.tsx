import React from 'react'
import { auth } from "@/auth"
import { User } from "@/models/User"
import connectDB from "@/lib/db"

import './dashbaord.css'
import GridLayout from './Gridlayout'
import { redirect } from 'next/navigation'
const Dashboard = async () => {
  const session = await auth()
  if (!session || !session.user || !session.user.email) {
    redirect('/login')
  }
  await connectDB();

  const user = await User.findOne({ email: session.user.email })
  const user_data = JSON.parse(JSON.stringify(user))
  if (!user_data) {
    return <div>User not found</div>
  }

  return (
    <GridLayout 
    userData={user_data}
/>
  )
}

export default Dashboard