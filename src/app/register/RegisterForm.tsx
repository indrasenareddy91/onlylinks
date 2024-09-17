vsimport React from 'react'
import { auth } from "@/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { register } from "@/action/user";
import { Mail, Lock, User } from "lucide-react";
import { useFormStatus } from "react-dom";
const RegisterForm = () => {
    const { pending } = useFormStatus();
  return (
    <form className="space-y-4" action={register} >
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white font-bold">Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  id="name"
                  placeholder="Patrick Bateman"
                  type="text"
                  name="name"
                  className="bg-black text-white border-gray-700 pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-bold">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  id="email"
                  placeholder="onlylinks@gmail.com"
                  type="email"
                  name="email"
                  className="bg-black text-white border-gray-700 pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white font-bold">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  id="password"
                  placeholder="*************"
                  type="password"
                  name="password"
                  className="bg-black text-white border-gray-700 pl-10"
                />
              </div>
            </div>
            <Button className="w-full bg-white text-black hover:bg-gray-200" type="submit">
        {
          pending ? "Loading..." : "Register"
        }
            </Button>
          </form>
  )
}

export default RegisterForm