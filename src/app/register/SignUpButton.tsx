"use client"
import React from 'react'
import { Button } from "@/components/ui/button";
import { useState } from 'react';
const SignUpButton = () => {

    const [loading, setLoading] = useState(false);
  return (
    <Button className="w-full bg-white text-black hover:bg-gray-200" type="submit"   onClick={()=>setLoading(true)}>
             {loading ? "Loading..." : "Sign up"}
     </Button>
  )
}

export default SignUpButton