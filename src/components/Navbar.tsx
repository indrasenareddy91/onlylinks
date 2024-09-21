"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Home, User, Settings, LogOut, LogIn } from "lucide-react";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col justify-between bg-white rounded-2xl w-full h-full p-4">
      {/* Links Section */}
      <ul className="space-y-4">
        <li>
          <Link href="/dashboard" className="flex items-center space-x-2 text-gray-700 hover:text-black">
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link href="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-black">
            <User className="w-5 h-5" />
            <span>Profile</span>
          </Link>
        </li>
        <li>
          <Link href="/settings" className="flex items-center space-x-2 text-gray-700 hover:text-black">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </li>
      </ul>

      {/* Sign In/Out Section */}
      <div className="mt-auto">
         
          <Button
            onClick={() => {
              signOut({
                redirect: true,
                callbackUrl: "/login",
              })
              
            }}
            variant="outline"
            className="w-full bg-[#5f45f2] text-[#ffd39e] hover:bg-[#4a3bc1] hover:text-[#ffd39e] flex items-center justify-center"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sign Out
          </Button>
        
      </div>
    </div>
  );
};

export default Navbar;