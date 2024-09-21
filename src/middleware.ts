import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDB from './lib/db';
import { auth } from "@/auth";
type SocialLink = {
  platform: string
  link: string
}
interface Session {
  user: {
    id: string
    name: string | null | undefined,
    email: string
    username?: string
    image?: string
    isUsernameSet?: boolean
    profilePic?: string
    profileDisplayName?: string
    profileBio?: string
    socialLinks?: SocialLink[]
  }
}
export async function middleware(req: NextRequest) {
  const session = await auth();
  await connectDB();

  if (session) {
    if(req.nextUrl.pathname === '/register' || req.nextUrl.pathname === '/login') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    
    const { username, socialLinks, profilePic } = session.user;

    // Redirect user if they visit /onboarding and have a username
    if (req.nextUrl.pathname === '/onboarding' && username) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Redirect user if they visit /onboarding/social-media and have social links
    if (req.nextUrl.pathname === '/onboarding/social-media' && socialLinks) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Redirect user if they visit /onboarding/profile and have a profile pic
    if (req.nextUrl.pathname === '/onboarding/profile' && profilePic) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  // Proceed if no conditions are met
  return NextResponse.next();
}

// Middleware matcher
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
  runtime: "nodejs",
  unstable_allowDynamic: [
      // allows a single file
      "/src/models/User.ts",
      // use a glob to allow anything in the function-bind 3rd party module
      "/node_modules/mongoose/dist/**",
  ],
};

