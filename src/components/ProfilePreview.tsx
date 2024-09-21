"use client"
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SocialLinks {
  _id: string;
  link: string;
  platform: string;
}

interface UserData {
  name: string;
  profileBio: string;
  email: string;
  isUsernameSet: boolean;
  socialLinks: SocialLinks[];
  profilePic: string;
  profileDisplayName: string;
  username: string;
}


const ProfilePreview: React.FC<{ userData: UserData }> = ({ userData }) => {
  return (
    <div className="flex justify-center items-center h-screen w-full bg-[#ffd39e]">
      <Card className="w-[75%] h-[500px] shadow-lg overflow-hidden">
        <ScrollArea className="h-full">
          <CardHeader className="text-center pt-6">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarImage src={userData.profilePic} alt={`${userData.username}'s profile picture`} />
              <AvatarFallback>{userData.username.slice(0,2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl font-bold">{userData.username}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 px-4 pb-6">
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
        </ScrollArea>
      </Card>
    </div>
  );
};

export default ProfilePreview;

