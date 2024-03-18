import NextAuth from "next-auth/next";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import pool from "@/lib/db/pg";
import { NextAuthOptions } from "next-auth";


export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
    }),
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        console.log("credentials", credentials);

        const { email, password} = credentials;

        const response = await pool.sql`SELECT * FROM users WHERE email = ${email}`;
        const user = response.rows[0];

        const passwordMatch = await compare(password, user.password);
        // Return null if user data could not be retrieved
        return passwordMatch? { id: user.id, email: user.email } : null;
      }
    }),
  ],
}

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

