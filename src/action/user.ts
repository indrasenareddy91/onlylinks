"use server";

import connectDB from "@/lib/db";
import { redirect } from "next/navigation";
import { hash } from "bcryptjs";
import { CredentialsSignin } from "next-auth";
import { signIn } from "@/auth";
import { User } from "@/models/User";
import { auth } from "@/auth";

import { Resend } from 'resend';
import otpGenerator from 'otp-generator';
import { createClient } from 'redis';

const client = createClient({
    password: `${process.env.REDIS_PASSWORD}`,
    socket: {
        host:  `${process.env.REDIS_URL}`,
        port: 18688
    }
});

const resend = new Resend(process.env.RESEND_API_KEY);

const login = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  try {
    await signIn("credentials", {
      redirect: true,
      callbackUrl: "/",
      email,
      password,
      name
    });
  } catch (error) {
    const someError = error as CredentialsSignin;
    return someError.cause;
  }
  redirect("/");
};

const registerUser = async (formData: FormData) => {
  // Extract user data from formData
  
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  try {
    await connectDB();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: "User already exists" };
    }

    const otp = otpGenerator.generate(6, { digits: true, specialChars: false , upperCaseAlphabets: false, lowerCaseAlphabets: false});

    // Store OTP in temporary storage (Redis) with a short expiration
   await client.connect();
    await client.set(`otp:${email}`, otp, {
        EX: 60 // 30 seconds expiration
    });
    await client.disconnect();

    // Send email with OTP
   const response = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Verify your email',
      html: `<p>Your OTP is: ${otp}</p><p>This OTP will expire in 60 seconds.</p>`
    });
    const expirationTime = Date.now() + 30000; // 30 seconds from now

    return { 
      status: true,
      success: "OTP sent successfully",
      expirationTime,
      userData: { email, password, name }
    };
  } catch (error) {
    return { status: false, error: "Failed to initiate registration process" };
  }
};

const verifyOTP = async (formData: FormData) => {
  const inputOTP = formData.get('otp') as string;
  const expirationTime = parseInt(formData.get('expirationTime') as string);
  const userData = JSON.parse(formData.get('userData') as string);
  const { email, password, name } = userData;
  if (Date.now() > expirationTime) {
    return { error: "OTP has expired" };
  }
  // Verify the OTP stored in Redis
  
  if(!client.isOpen){
    await client.connect()

  }
  const storedOTP = await client.get(`otp:${email}`);
  if ( inputOTP !== storedOTP) {
    return { error: "Invalid OTP" };
  }

  // If OTP is valid, delete it from Redis to prevent reuse
  await client.del(`otp:${email}`);
  await client.disconnect();

  try {
    const hashedPassword = await hash(password, 10);
    const user = new User({ email, password: hashedPassword, name });

    const session = await signIn("credentials", {
    redirect: false,
    email,
    password,
    
  });
    return { success: "User registered succssfully", };
  } catch (error) {
    return { error: "Failed to register user" };
  }
};

const googleSignIn = async (formData: FormData) => {
    const signInss  =  await signIn("google", {
      redirect:true,
      redirectTo: "/onboarding",
  });
};

//code a resendotp function
const resendOTPP = async (formData: FormData) => {
  const email = formData.get('email') as string;
  
  if (!email) {
    return { error: "Email is required" };
  }

  try {
    if (!client.isOpen) {
      await client.connect();
    }

    // Generate a new OTP
    const otp = otpGenerator.generate(6, { digits: true, specialChars: false , upperCaseAlphabets: false, lowerCaseAlphabets: false});

    // Store OTP in temporary storage (Redis) with a short expiration
    await client.set(`otp:${email}`, otp, {
        EX: 60 // 30 seconds expiration
    });
    await client.disconnect();

    // Send email with OTP
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Verify your email',
      html: `<p>Your OTP is: ${otp}</p><p>This OTP will expire in 60 seconds.</p>`
    });

    return { success: "New OTP sent successfully"  , status : true};
  } catch (error) {
    console.error("Error resending OTP:", error);
    return { error: "Failed to resend OTP" };
  }
};
// ... existing code ...
const checkUsername = async (username: string): Promise<boolean> => {
  // Implement the logic to check if the username is available
  const user = await User.findOne({ username });
  if (user) {
    return false
  }
  return true
  // Return true if available, false if not
};

const updateUsername = async (username: string)=> {
  // Implement the logic to update the user's username in your database
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("User not authenticated");
  }

  const userEmail = session.user.email;
  if (!userEmail) {
    throw new Error("User email not found in session");
  }

  const updatedUser = await User.findOneAndUpdate(
    { email: userEmail },
    { username: username , 
      isUsernameSet: true

    },
    { new: true }
  );

  if (!updatedUser) {
    throw new Error("User not found or username update failed");
  }
  return true;
  
}
interface SocialLink {
  platform: string;
  link: string;
}
const updateUserProfile = async (socialLinks : SocialLink[]) => {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("User not authenticated");
  }

  const userEmail = session.user.email;
  if (!userEmail) {
    throw new Error("User email not found in session");
  }
  const updatedUser = await User.findOneAndUpdate(
    { email: userEmail },
    { socialLinks: socialLinks },
    { new: true }
  );

  if (!updatedUser) {
    return false
    throw new Error("User not found or profile update failed");
  }
  return true
}

const updateUserProfileDetails = async (profilePic: string | undefined, profileDisplayName: string, profileBio: string) => {
  const session = await auth();
  if (!session || !session.user) {
    console.log('user not authenticated')
    throw new Error("User not authenticated");
  }

  const userEmail = session.user.email;
  if (!userEmail) { 
    console.log('user email not found in session')
    throw new Error("User email not found in session");
  }
  const updatedUser = await User.findOneAndUpdate(
    { email: userEmail },
    { profilePic, profileDisplayName, profileBio },
    { new: true }
  );

  if (!updatedUser) {
    return false
    throw new Error("User not found or profile update failed");
  }

  
  return true
}

const deleteLink = async (id: string) => {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("User not authenticated");
  }

  const userEmail = session.user.email;
  if (!userEmail) {
    throw new Error("User email not found in session");
  }

  const updatedUser = await User.findOneAndUpdate(
    { email: userEmail },
    { $pull: { socialLinks: { _id: id } } },
    { new: true }
  );
}

interface Link {
  _id: string;
  link: string;
  platform: string;
}
const addLink = async (newLink: Link) => {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("User not authenticated");
  }
  const userEmail = session.user.email;
  if (!userEmail) {
    throw new Error("User email not found in session");
  }
  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail },
      { $push: { socialLinks: { platform: newLink.platform, link: newLink.link, _id: newLink._id } } },
      { new: true }
    );
    return true;
  } catch (error) {
    console.error('Error adding link:', error);
    return false;
  }
} 

const updateProfile = async (profile: any) => {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("User not authenticated");
  }

  const userEmail = session.user.email;
  if (!userEmail) { 
    throw new Error("User email not found in session");
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail },
      { $set: profile },
      { new: true } 
    );
    if (!updatedUser) {
      return false
      throw new Error("User not found or profile update failed");
    }
     const updatedUserData =  JSON.parse(JSON.stringify(updatedUser))
    return updatedUserData;
  } catch (error) {
    console.error("Error updating profile:", error);
    return false;
  
  }
}
const getUserByUsername = async (username: string) => {

  const user = await User.findOne({ username });
  return user;
}
export { registerUser, login, googleSignIn, verifyOTP , checkUsername, updateUsername  , resendOTPP , updateUserProfile , updateUserProfileDetails , deleteLink , addLink , updateProfile , getUserByUsername};