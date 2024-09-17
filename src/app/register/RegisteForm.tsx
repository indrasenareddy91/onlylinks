"use client"
import { auth } from "@/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { register  , googleSignIn } from "@/action/user";
import { Mail, Lock, User } from "lucide-react";

const RegisterForm = async () => {
    const [ loading, setLoading] = useState(false);
  return (
    <div className="h-screen w-full flex justify-center items-center bg-black text-white">
      <Card className="w-full max-w-sm bg-black border-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-white">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" action={register}>
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
            <Button className="w-full bg-white text-black hover:bg-gray-200" type="submit"   onClick={()=>setLoading(true)}>
             {loading ? "Loading..." : "Sign up"}
            </Button>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full bg-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black px-2 text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>
            
            <form
              className="mt-6"
              action={googleSignIn}
            >
              <Button className="w-full bg-white text-black hover:bg-gray-200 flex items-center justify-center" type="submit" variant="outline">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  <path d="M1 1h22v22H1z" fill="none"/>
                </svg>
                Google
              </Button>
            </form>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full text-gray-400">
            Already have an account? <Link href="/login" className="underline text-white">Login</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
