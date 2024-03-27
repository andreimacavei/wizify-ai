"use server";

import { prisma } from "@/lib/db/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/authOptions";

// Fetch all domains but limited to 20
export const fetchAllData = async () => {
  // Check if user is logged in
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return null;

  const { user } = session;
  const userDomains = await prisma.domains.findMany({
    where: {
      user: {
        id: user.id,
      },
    },
    orderBy: {
      hostname: "desc",
    },
    take: 20,
  });

  return userDomains;
};
