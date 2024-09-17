"use client"
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { Home, User, Settings, LogOut, LogIn } from 'lucide-react'

const Navbar = () => {
  const { data: session } = useSession()

  return (
    <nav className="flex flex-col h-screen w- bg-[#fff] p-5 space-y-6 rounded-r-2xl shadow-lg  m-5 mt-12 ">
      <div className="flex flex-col space-y-4">
        <Link href="/dashboard" className="flex items-center space-x-3 text-[#000] hover:text-[#4a3bc1] transition-colors duration-200">
          <Home size={20} />
          <span className="text-lg font-semibold">Dashboard</span>
        </Link>
        <Link href="/profile" className="flex items-center space-x-3 text-[#000] hover:text-[#4a3bc1] transition-colors duration-200">
          <User size={20} />
          <span className="text-lg font-semibold">Profile</span>
        </Link>
        <Link href="/settings" className="flex items-center space-x-3 text-[#000] hover:text-[#4a3bc1] transition-colors duration-200">
          <Settings size={20} />
          <span className="text-lg font-semibold">Settings</span>
        </Link>
      </div>
      <div className="mt-auto">
        {session ? (
          <Button
            onClick={() => signOut()}
            variant="outline"
            className="w-full bg-[#5f45f2] text-[#ffd39e] hover:bg-[#4a3bc1] hover:text-[#ffd39e]"
          >
            <LogOut className='text-white mr-2' size={20} />
            <span className='text-white'>Sign Out</span>
          </Button>
        ) : (
          <Button asChild variant="default" className="w-full">
            <Link href="/login" className="flex items-center justify-center space-x-2">
              <LogIn size={20} />
              <span>Sign In</span>
            </Link>
          </Button>
        )}
      </div>
    </nav>
  )
}

export default Navbar