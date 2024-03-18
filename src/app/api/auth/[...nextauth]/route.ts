import NextAuth from "next-auth";
import { authOptions } from "@/config/authOptions";

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

