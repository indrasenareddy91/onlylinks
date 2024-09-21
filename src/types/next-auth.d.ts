import NextAuth from "next-auth"
import { DefaultSession } from "next-auth"
declare module "next-auth" {
  type SocialLink = {
    platform: string
    link: string
  }

    interface Session {
    user: {
      id: string
      name: string |  null | undefined  ,
      email: string
      username?: string
      image?: string
      isUsernameSet?: boolean
      profilePic?: string | null,
      profileDisplayName?: string
      profileBio?: string
      socialLinks?: SocialLink[]

      // Add any other properties your user object might have
    } & DefaultSession["user"]

  }
  interface User {
    /** Custom username field */
    username?: string;
    profileDisplayName?:string,
    profileBio?:string,
    profilePic?:string,
    socialLinks?: SocialLink[],
    isUsernameSet?: boolean
  
  }

 
}
