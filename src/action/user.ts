"use server";

import connectDB from "@/lib/db";
import { redirect } from "next/navigation";
import { hash } from "bcryptjs";
import { CredentialsSignin } from "next-auth";
import { signIn } from "@/auth";
import { User } from "@/models/User";
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

const register = async (formData: FormData) => {
  const firstName = formData.get("name") as string;
  console.log(firstName)
  const email = formData.get("email") as string;
  console.log(email)
  const password = formData.get("password") as string;
   console.log(password)
  if (!firstName  || !email || !password) {
    throw new Error("Please fill all fields");
  }

  await connectDB();

  // existing user
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await hash(password, 12);

  await User.create({ firstName, email, password: hashedPassword });
  console.log(`User created successfully 🥂`);
  redirect("/login");
};



export { register, login };