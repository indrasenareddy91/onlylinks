import React from 'react'
import { auth } from "@/auth"
import { User } from "@/models/User"
import connectDB from "@/lib/db"
import Navbar from '@/components/Navbar'
import ProfileEditor from '@/components/ProfileEditor'
import ProfilePreview from '@/components/ProfilePreview'
import './dashbaord.css'
const Dashboard = async () => {
  const session = await auth()
  if (!session || !session.user || !session.user.email) {
    return <div>Not authenticated</div>
  }
  await connectDB();

  const user = await User.findOne({ email: session.user.email })
  console.log(user)
  const user_data = JSON.parse(JSON.stringify(user))
  console.log(user_data)
  if (!user_data) {
    return <div>User not found</div>
  }

  return (
    <div className="grid grid-cols-4 gap-4 h-screen overflow-hidden" style={{
      background:"#ffd39e"
    }}>
      <div className="col-span-1  ">
        <Navbar />
      </div>
      <div className="col-span-2  ">
        <ProfileEditor userData={user_data} />
      </div>
      <div className="col-span-1">
        <ProfilePreview userData={user_data} />
      </div>
    </div>
  )
}

export default Dashboard