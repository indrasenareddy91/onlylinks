import React from 'react'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { getUserByUsername } from '@/action/user'
import connectDB from '@/lib/db'

interface Link {
  id: string;
  link: string;
  platform: string;
}

interface UserData {
  name: string;
  profileBio: string;
  email: string;
  username: string;
  isUsernameSet: boolean;
  socialLinks: Link[];
  profilePic: string;
  profileDisplayName: string;
}

const Profile = async ({ params }: { params: { id: string } }) => {
  await connectDB()
  const userData: UserData | null = await getUserByUsername(params.id)

  if (!userData) {
    return <div className="flex justify-center items-center h-screen">User not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="w-full max-w-2xl p-4 md:p-8 text-center">
        <Avatar className="w-24 h-24 mx-auto mb-4">
          <AvatarImage src={userData.profilePic} alt={`${userData.username}'s profile picture`} />
          <AvatarFallback>{userData.username.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <h1 className="text-2xl md:text-3xl font-bold mb-4">{userData.username}</h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">{userData.profileBio}</p>
        <div className="space-y-3 md:space-y-4">
          {userData.socialLinks.map((link, index) => (
            <Button
              key={index}
              variant="outline"
              size="lg"
              className="w-full max-w-xs mx-auto text-base hover:bg-gray-200 transition-colors"
              asChild
            >
              <a href={link.link} target="_blank" rel="noopener noreferrer">
                {link.platform}
              </a>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Profile