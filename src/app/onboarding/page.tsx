"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateUsername, checkUsername } from "@/action/user";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { BadgeCheck, X, Loader2 } from 'lucide-react';
import './onbaording.css'
import { Session } from 'next-auth/react';

declare module 'next-auth/react' {
  type SocialLink = {
    platform: string
    link: string
  }
  interface Session {
    user: {
      id: string
      name: string | null | undefined,
      email: string
      username?: string
      image?: string
      isUsernameSet?: boolean
      profilePic?: string
      profileDisplayName?: string
      profileBio?: string
      socialLinks?: SocialLink[]
    }
  }
}

const UsernamePage = () => {
  const { data , update} = useSession();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [showRule, setShowRule] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  const checkUsernameAvailability = async (value: string) => {

try {
  const available = await checkUsername(value);
  setIsAvailable(available);
  setIsChecking(false);
} catch (error) {
  console.error("Error checking username availability:", error);
}
    
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    setShowRule(false);

    if (debounceTimeout) clearTimeout(debounceTimeout);

    if (value.length > 3) {
      setIsChecking(true)
      setIsAvailable(null);
      const newTimeout = setTimeout(() => checkUsernameAvailability(value), 500);
      setDebounceTimeout(newTimeout);
    } else {
      setIsAvailable(null)
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget as HTMLFormElement;
    const usernameInput = formElement.querySelector('#username') as HTMLInputElement;
    
    if (usernameInput.value.length <= 3) {
      setShowRule(true);
      return;
    }
    
    if (!isAvailable) return;
    setLoading(true);
    try {
     const result = await updateUsername(username);
      if(result){
        console.log('inside thiw shit')
        update({ user: { ...data?.user, username: username  , isUsernameSet: true} });
        router.push('/onboarding/social-media');

      }
    } catch (error) {
      console.error("Error updating username:", error);
    } finally {
    }
  };

  return (
    <div className="grid grid-cols-10 h-screen bg-[#ffd39e] text-[#5f45f2]">
      <div className="col-span-7 flex items-center justify-center">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-4">Welcome to Onlylinks</h1>
          <p className="text-center mb-8">Account created successfully</p>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="relative">
              <input
                id="username"
                type="text"
                placeholder="Choose your username"
                className="w-full p-3 pr-10 border border-[#5f45f2] rounded-md focus:ring-2 focus:ring-[#5f45f2] focus:border-transparent"
                value={username}
                onChange={handleUsernameChange}
                required
                minLength={4}
                pattern="^[a-zA-Z0-9_]+$"
              />
              {isChecking && username.length > 3 &&  (
                <Loader2 className="spin absolute right-3 top-1/2 transform -translate-y-1/2 text-[#000]" size={18} style={{
                  display: "block",
                  marginTop: "-9px" // Adjust this value based on the loader's height
                }} />
              )}
              {
               !isChecking && username.length > 3 && isAvailable !== null && (
                isAvailable ? (
                  <BadgeCheck className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[green]" size={18} />
                ) : (
                  <X className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[red]" size={18} />
                )
              )
              }
            </div>
            {showRule && (
              <p className="mt-2 text-sm text-red-600">
                Username must be more than 3 characters long.
              </p>
            )}
            {username.length > 3 && isAvailable !== null && (
              <p className={`mt-2 text-sm ${
                isAvailable ? 'text-green-600' : 'text-red-600'
              }`}>
                {isAvailable ? 'Username is available' : 'Username is not available'}
              </p>
            )}
            <button 
              className="w-full py-3 px-4 bg-[#5f45f2] text-white rounded-md hover:bg-opacity-90 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5f45f2]" 
              type="submit" 
              disabled={loading || !isAvailable || username.length <= 3}
            >
              {loading ? "Processing..." : "Continue"}
            </button>
          </form>
        </div>
      </div>
      <div className="col-span-3 relative">
        <Image
          src="/path-to-your-image.jpg"
          alt="Onlylinks onboarding"
          layout="fill"
          objectFit="cover"
        />
      </div>
    </div>
  );
};

export default UsernamePage;