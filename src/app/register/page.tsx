import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { register } from "@/action/user";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { redirect } from "next/navigation";
import { auth } from "@/auth";

const Register = async () => {
  const session = await auth();
  const user = session?.user;
  if (user) redirect("/");

    return (
    <div style={{
        height:"100vh",
        width:"100%",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        
    }}>   <Card className="w-[200px] mt-10 max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white" style={{
           
        }} >
          <CardHeader>
            <CardTitle>Onlylinks</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={register}>
              <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" placeholder="patrick bateman" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email"  name="email" placeholder="onlylinks@gmail.com" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" placeholder="***************"  type="password"/>
                </div>
                <div className="flex flex-col space-y-1.5">
                <Button  type="submit" className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]">
          Sign up &rarr;
        </Button>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
         
        
          </CardFooter>
          <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300" style={{
            textAlign:"center"
          }}>
          Already have an account? <Link href="/login">Login</Link>
        </p>
        </Card>
        </div>
      )


}
 
export default Register;
