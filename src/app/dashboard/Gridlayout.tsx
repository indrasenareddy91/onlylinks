"use client"
import React, { ReactNode } from 'react'
import Navbar from '@/components/Navbar'
import ProfileEditor from '@/components/ProfileEditor'
import ProfilePreview from '@/components/ProfilePreview'
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
  interface GridLayoutProps {
   
    userData: UserData; // Replace `any` with a specific type if possible
  }
  const GridLayout: React.FC<GridLayoutProps> = ({ userData }) => {

    const [data , setUpdate] = React.useState<UserData>(userData)
    const hideScrollbarStyle = `
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none; /* IE and Edge */
      scrollbar-width: none; /* Firefox */
    }
  `;

  const handleProfileUpdate = (newdata: Partial<UserData>) => {
    setUpdate((prevData) => ({
      ...prevData,
      ...newdata, // Merge newdata into userdata
    }));
  };
  

  // Insert style tag to hide the scrollbar globally
  const StyleTag = () => <style>{hideScrollbarStyle}</style>;
    return (
      <div className="grid grid-cols-4 h-screen gap-4 bg-[#ffd39e]" style={{
        boxSizing:"border-box"
      }}>
        <div className="col-span-1 m-5" style={{
            boxSizing:"border-box"
        }}>
          <Navbar />
        </div>
        <div className=" col-span-2 overflow-y-auto scrollbar-hide" style={{
            boxSizing:"border-box",
            paddingTop:"20px",
            scrollbarWidth: "none",
        }} >
          <ProfileEditor userData={data}   onSave={handleProfileUpdate} />
        </div>
        <div className="bg-gray-200 col-span-1">
          <ProfilePreview userData={data} />
        </div>
      </div>
    )
  }
  

export default GridLayout