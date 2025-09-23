import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connecttodatabase from "@/config/db";
import User from "@/models/usermodel";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      await connecttodatabase();
      let existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        existingUser = await User.create({
          name: user.name,
          email: user.email,
          image: user.image,
          isGoogleUser: true,
          password: null,
        });
      }

      user._id = existingUser._id;
      return true;
    },

    async jwt({ token, user }) {
      if (user) token.id = user._id?.toString() || token.id;
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default async function auth(req, res) {
  return await NextAuth(req, res, {
    ...authOptions,
    callbacks: {
      ...authOptions.callbacks,
      async signIn({ user, account, profile }) {
        const allowed = await authOptions.callbacks.signIn({ user, account, profile });
        
        if (allowed) {
          const appToken = jwt.sign(
            { userId: user._id?.toString() },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
          );

          res.setHeader("Set-Cookie", serialize("token", appToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60,
            sameSite: "lax",
            path: "/",
            secure: process.env.NODE_ENV === "production",
          }));
        }

        return allowed;
      },
    },
  });
}
