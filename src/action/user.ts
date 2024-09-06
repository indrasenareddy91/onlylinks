"use server";

import connectDB from "@/lib/db";
import { redirect } from "next/navigation";
import { hash } from "bcryptjs";
import { CredentialsSignin } from "next-auth";
import { signIn } from "@/auth";
import { User } from "@/models/User";
import { Resend } from 'resend';
import otpGenerator from 'otp-generator';
import { createClient } from 'redis';

const client = createClient({
    password: 'kSseGxKbmleSVp47z0h5uY5lo5h03Ig7',
    socket: {
        host: 'redis-18688.c16.us-east-1-2.ec2.redns.redis-cloud.com',
        port: 18688
    }
});
const resend = new Resend(process.env.RESEND_API_KEY);

const login = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await signIn("credentials", {
      redirect: true,
      callbackUrl: "/",
      email,
      password,
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
    console.log(existingUser)
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
    await resend.emails.send({
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
  const { email, password, name:firstname } = userData;
console.log(inputOTP)
  if (Date.now() > expirationTime) {
    return { error: "OTP has expired" };
  }
  // Verify the OTP stored in Redis
  await client.connect();
  const storedOTP = await client.get(`otp:${email}`);
console.log(storedOTP)
  if ( inputOTP !== storedOTP) {
    return { error: "Invalid OTP" };
  }

  // If OTP is valid, delete it from Redis to prevent reuse
  await client.del(`otp:${email}`);
  await client.disconnect();

  try {
    const hashedPassword = await hash(password, 10);
    const user = new User({ email, password: hashedPassword, firstname });
   console.log(await user.save()) 
    return { success: "User registered successfully", };
  } catch (error) {
    console.log(error)
    return { error: "Failed to register user" };
  }
};

const googleSignIn = async (formData: FormData) => {
  await signIn("google", {
    redirect: true,
    callbackUrl: "/",
  });
};

export { registerUser, login, googleSignIn, verifyOTP };