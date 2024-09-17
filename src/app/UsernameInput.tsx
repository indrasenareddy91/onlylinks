
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { redirect } from 'next/navigation'
import Link from "next/link"

const UsernameInput = () => {

  
  

  return (
      <div className="flex items-center border-b border-black py-2">
        <Input
          className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          type="text"
          placeholder="Choose your username"
          aria-label="Username"
          required
        />
        <Button
          className="flex-shrink-0 bg-black hover:bg-gray-800 border-black hover:border-gray-800 text-sm border-4 text-white py-1 px-2 rounded"
          type="submit"
          
        >
         <Link href="/register"> Get Started</Link>
        </Button>
      </div>
  
  )
}

export default UsernameInput