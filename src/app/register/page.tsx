"use client"
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser, googleSignIn, verifyOTP } from "@/action/user";
import { Mail, Lock, User, Loader2, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const RegisterForm = () => {
  type userData = {
    status: boolean;
    success: string;  
    userData: { name: string , email :  string , password: string; }
  }
  const router  = useRouter()
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [userData, setUserData] = useState<Object | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(60);
  const inputElements = useRef<HTMLInputElement[]>([]);
  const [otpSuccess, showOTPSuccess] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
 
  const { register: registerField, handleSubmit, formState: { errors }, trigger } = useForm();

  useEffect(() => {
   if(inputElements.current.length > 0){
    inputElements.current[0].focus();
   }
  }, [showOTP])

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showOTP) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(timer);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showOTP]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    try {
      const response: userData |  any = await registerUser(formData);
      if (response.status) {
        setUserData(response?.userData);
        setShowOTP(true);
        setRemainingTime(60);
      } else {
        setServerError(response.error || "Registration failed");
      }
    } catch (error) { 
       setServerError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const onOTPSubmit = async ({otp}:{otp:string}) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('userData', JSON.stringify(userData));
      formData.append('otp',  otp);
      formData.append('expirationTime', (Date.now() + 60000).toString());
      console.log(formData.get('otp'));
      const response = await verifyOTP(formData);
      console.log(response)
      if (response.success) {
        showOTPSuccess(true);
        setDialogMessage("OTP verified successfully!");
        setTimeout(() => {
          router.push('/');
        },  1000);
      } else {
        setOtpError(true);
        setDialogMessage("Incorrect OTP. Please try again.");
        setOtp(new Array(6).fill(''));


        inputElements.current[0]?.focus();
      }
      setShowDialog(true);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const validateOTP = (enteredOTP: string) => {
    if (remainingTime <= 0) {
      setOtpError(true);
      showOTPSuccess(false);
      setDialogMessage("OTP has expired");
      setShowDialog(true);
    } else {
      setOtpError(false);
      onOTPSubmit({ otp: enteredOTP });
    }
  };

  return (
    <div className="h-screen w-full flex justify-center items-center bg-black text-white">
      <Card className="w-full max-w-sm bg-black border-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-white">Register</CardTitle>
        </CardHeader>
        <CardContent>
          {!showOTP ? (
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white font-bold">Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="name"
                    placeholder="Patrick Bateman"
                    type="text"
                    className="bg-black text-white border-gray-700 pl-10"
                    {...registerField("name", { required: "Name is required" })}
                  />
                </div>
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message?.toString()}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-bold">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="email"
                    placeholder="onlylinks@gmail.com"
                    type="email"
                    className="bg-black text-white border-gray-700 pl-10"
                    {...registerField("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Invalid email address"
                      }
                    })}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message?.toString()}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-bold">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="password"
                    placeholder="*************"
                    type="password"
                    className="bg-black text-white border-gray-700 pl-10"
                    {...registerField("password", { 
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters"
                      }
                    })}
                  />
                </div>
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message?.toString()}</p>}
              </div>
              {serverError && <p className="text-red-500 text-sm">{serverError}</p>}
              <Button className="w-full bg-white text-black hover:bg-gray-200" type="submit" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {loading ? "Signing up..." : "Sign up"}
              </Button>
            </form>
          ) : (
          <div>    
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-white font-bold">Enter OTP</Label>
              <div className="flex justify-between">
              {otp.map((value, index) => (
               
                <Input
                  key={index}
                  type="text"
                  value={value}
                  maxLength={1}
                  className={`w-10 h-10 text-center bg-black text-white ${otpError ? 'border-red-500' : ''}`}
                  ref={(el) => {
                    registerField(`otp.${index}`).ref(el);
                    if (el) inputElements.current[index] = el;
                  }}
                  onKeyDown={(event : React.KeyboardEvent<HTMLInputElement>) => {
                    if (event.key == 'Backspace') {
                      console.log('hello');
                
                      const newOtp = [...otp];
                      newOtp[index] = '';
                      setOtp(newOtp);
                      const value =  event.target as HTMLInputElement
                      if (index > 0 && !value) {
                        inputElements.current[index - 1].focus();
                      }
                    }
                  }}
                  onPaste={(e) => {
                    const paste = e.clipboardData.getData('text'); // Getpasted text from clipboard
                    const newOtp = paste.split('');

                    console.log(newOtp)
                    if (newOtp.length == otp.length) {
                      setOtp(newOtp);
                      inputElements.current[otp.length - 1].focus();
                    } else {
                      alert('bull shit');
                    }
                
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    const newOtp = [...otp];
                    newOtp[index] = value;
                    setOtp(newOtp);
                    if (value && index < otp.length - 1) {
                      inputElements.current[index + 1]?.focus();
                    } else if (index === otp.length - 1) {
                      // Only validate when the last digit is entered
                      const fullOtp = newOtp.join('');
                      if (fullOtp.length === otp.length) {
                        validateOTP(fullOtp);
                      }
                    }
                  }}
                />
              ))}
              </div>
            </div>
            
          <p className="text-center mt-4 text-sm text-gray-400">
            OTP expires in: {remainingTime} seconds
          </p>
            {otpSuccess ? (
              <Button className="w-full bg-green-500 text-white hover:bg-green-600 mt-4 flex items-center justify-center" disabled>
                <CheckCircle className="w-5 h-5 mr-2 animate-pulse" />
                OTP Verified
              </Button>
            ) : (
              <Button 
                className="w-full bg-white text-black hover:bg-gray-200 mt-4" 
                type="button" 
                disabled={loading}  
                onClick={() => {
                  if(otp.every(digit => digit !== '')){
                    validateOTP(otp.join(''));
                  }
                  else{
                    setDialogMessage("Please fill in all OTP digits before verifying.");
                    setShowDialog(true);
                  }
                }}
              >
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
            )}
          </div>
          )}
          
          {!showOTP && (
            <>
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
            </>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full text-gray-400">
            Already have an account? <Link href="/login" className="underline text-white">Login</Link>
          </p>
        </CardFooter>
      </Card>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogMessage}</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RegisterForm;
