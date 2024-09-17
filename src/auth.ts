import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { User } from "@/models/User";
import { compare } from "bcryptjs";
import connectDB from "@/lib/db";
import { redirect } from "next/navigation";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      authorize: async (credentials) => {
        const email = credentials.email as string | undefined;
        const password = credentials.password as string | undefined;
        

        if (!email || !password) {
          throw new CredentialsSignin("Please provide both email & password");
        }

        await connectDB();

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
          throw new Error("Invalid email or password");
        }

        if (!user.password) {
          throw new Error("Invalid email or password");
        }

        const isMatched = await compare(password, user.password);

        if (!isMatched) {
          throw new Error("Password did not matched");
        }
   
        const userData = {
          name: user.name,
          email: user.email,
          id: user._id.toString(),
          image: user?.image || undefined,
        };
        return userData;
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  callbacks: {
   
    async session({ session,token }) {
  
      if (token?.sub) {
        session.user.id = token.sub;
        session.user.name = token.name
       
      }
      return session;
    },

    async jwt({ token, user }) {
      
     if(user){
      token.id = user.id
      token.email = user.email
      token.name = user.name
     }
      return token;
    },

    signIn: async ({ user, account }) => {
      if (account?.provider === "google") {
        try {
          const { email, name, image, id } = user;
          await connectDB();
          const alreadyUser = await User.findOne({ email });

          if (!alreadyUser) {
            await User.create({ email, name, image, authProviderId: id });
          } else {
            // Update the existing user's information
            await User.findOneAndUpdate(
              { email },
              { $set: { name, image, authProviderId: id } },
              { new: true }
            );
          }
          return true;
        } catch (error) {
          throw new Error("Error while creating user");
        }
      }

      if (account?.provider === "credentials") {
        return true;
      } else {
        return false;
      }
    },
  },
});

