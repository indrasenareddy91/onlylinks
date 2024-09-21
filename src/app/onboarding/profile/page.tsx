"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { updateUserProfileDetails } from "@/action/user";

const ProfilePage = () => {
  const router = useRouter();
  const { data: session , update } = useSession();
  const [profilePic, setProfilePic] = useState<string>('');
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (session?.user?.image) {
      console.log('hello')
      setProfilePic(session.user.image);
    }
  }, [session]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    
    try {
      const result  =   await updateUserProfileDetails(profilePic, displayName, bio); 
      if(result){
        update({ user: { ...session?.user, profilePic, profileDisplayName: displayName, profileBio: bio} });
          router.push('/dashboard')
      }
    }
    catch(e){
      alert(e)
    }
  }
  return (
    <div className="h-screen w-full flex justify-center items-center bg-[#ffd39e] text-[#5f45f2] p-4">
      <Card className="w-full max-w-lg bg-white text-black border-[#5f45f2]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-[#5f45f2]">Complete Your Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => router.back()} variant="outline" className="self-start mb-4 text-[#5f45f2] border-[#5f45f2]">
            Back
          </Button>
          <div className="flex flex-col items-center">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              {profilePic ? (
                <AvatarImage src={profilePic} alt={`'s profile picture`} />
              ) : (
                <AvatarFallback>{`hello`}</AvatarFallback>
              )}
            </Avatar>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-2"
              style={{
                background:"#ffd39e",
                border:'1px solid black'
              }}
            />
          </div>
          <div>
            <label htmlFor="displayName" className="font-bold text-[#5f45f2]">Display Name</label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your display name"
              className="bg-[#ffd39e] text-[#5f45f2] border-gray-700 mt-2"
            />
          </div>
          <div>
            <label htmlFor="bio" className="font-bold text-[#5f45f2]">Short Bio</label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write a short bio"
              className="bg-[#ffd39e] text-[#5f45f2] border-gray-700 mt-2"
            />
          </div>
          <Button 
            onClick={handleSubmit}
            className="bg-[#5f45f2] text-white hover:bg-[#4a3bc1] w-full"
          >
            Finish
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;