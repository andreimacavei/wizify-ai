// import Google from "next-auth/providers/google";
import EmailProvider, { SendVerificationRequestParams } from "next-auth/providers/email";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { Resend } from 'resend';
import { NextAuthOptions } from "next-auth";
import { prisma } from "@/lib/db/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { initUserData } from "@/app/lib/actions";
import generateUrlSafeBase64ApiKey from "@/utils/generateB64Key";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  
  providers: [
    GoogleProvider({
      id: "google",
      name: "Google",
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    EmailProvider({
      server: '',
      from: 'noreply@breaktime.ltd',
      sendVerificationRequest : async ( params: SendVerificationRequestParams ) => {
        let { identifier, url, provider } = params;
        try {
          let resend = new Resend(process.env.RESEND_API_KEY!)
          await resend.emails.send({
            from: provider.from,
            to: identifier,
            subject: 'Your Wizard AI Login Link',
            html: '<html><body>\
              <h2>Your Login Link</h2>\
              <p>Welcome to AIWizzard!</p>\
              <p>Please click the magic link below to sign in to your account.</p>\
              <p><a href="' + url + '"><b>Sign in</b></a></p>\
              <p>or copy and paste this URL into your browser:</p>\
              <p><a href="' + url + '">' + url + '</a></p>\
              <br /><br /><hr />\
              <p><i>This email was intended for ' + identifier + '. If you were not expecting this email, you can ignore this email.</i></p>\
              </body></html>',
          });
        } catch (error) {
          console.log({ error });
        }
      },
    }),
  ],

  debug: process.env.NODE_ENV === "development",

  callbacks: {
    async signIn({ user, account, profile, credentials }) {

      if (account?.provider === 'email') {
        // TODO check if email is verified
      } else if (account?.provider === 'google') {
       
        // user.image = profile?.image;
        // Only allow access from some domains to register
        // return profile.email_verified && profile.email.endsWith("@example.com")
      } else if (account?.provider === 'github') {

      }

      return true;
    },

    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
  
  events: {
    createUser: async (message) => {
      // Record event log: new user signup
      // await recordEvent('signup')
      // Add user to a free subscription plan after signup
      console.log('New user signed up:', message.user.email, message.user.id)
      // TODO generate using crypto-js
      const userKey = generateUrlSafeBase64ApiKey();
      // console.log('Generated user key:', userKey)
      await initUserData('Free', message.user.id, userKey)
    }
  }
}