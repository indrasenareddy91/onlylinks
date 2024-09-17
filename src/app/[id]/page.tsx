import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { getUserByUsername } from '@/action/user' // Assuming you have a database utility function
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
    return <div>User not found</div>
  }

  return (
    <div className="flex justify-center items-center h-full w-full bg-gray-100 overflow-y-auto">
      <Card className="w-80 shadow-lg my-4">
        <CardHeader className="text-center">
          <Avatar className="w-24 h-24 mx-auto mb-4">
            <AvatarImage src={userData.profilePic} alt={`${userData.username}'s profile picture`} />
            <AvatarFallback>{userData.username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl font-bold">{userData.username}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-gray-600">{userData.profileBio}</p>
          <div className="flex flex-col space-y-2">
            {userData.socialLinks.map((link, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="w-full text-sm hover:bg-gray-100 transition-colors"
                asChild
              >
                <a href={link.link} target="_blank" rel="noopener noreferrer">
                  {link.platform}
                </a>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Profile