import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import User from "@/lib/models/User";
import dbConnect from "@/lib/db/mongodb";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      role?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }
        await dbConnect();
        
        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("No user found");
        
        if (!user.password) throw new Error("Please log in with Google");

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid password");
        
        if (!user.isActive) throw new Error("Account deactivated");
        
        user.lastLogin = new Date();
        await user.save();
        
        return {
          id: user._id.toString(),
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: { token: any, user?: any }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && profile) {
        const googleProfile = profile as any;
        await dbConnect();
        let existingUser = await User.findOne({ email: googleProfile.email });
        
        if (!existingUser) {
          existingUser = await User.create({
            firstName: googleProfile.given_name || "Google",
            lastName: googleProfile.family_name || "User",
            email: googleProfile.email,
            emailVerified: true,
            authProvider: 'google',
            googleId: googleProfile.sub,
            profileImage: googleProfile.picture
          });
        }
        
        user.id = existingUser._id.toString();
        user.role = existingUser.role;
      }
      return true;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
};
