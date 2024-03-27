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

export const fetchUserData = async () => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return null;

  const { user } = session;
  const userData = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });
  console.log("userData: ", userData);

  // Create a join query to fetch user subscription plan
  const userSubscriptionPlan = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      subscription: {
        select: {
          plan: true,
        },
      },
    },
  });
  console.log("userSubscriptionPlan: ", userSubscriptionPlan);

  // const userDomains = await prisma.domains.findMany({
  //   where: {
  //     user: {
  //       id: user.id,
  //     },
  //   },
  // });

  return {
    userCredits: userData.credits,
    subscriptionPlan: userSubscriptionPlan.subscription.plan,
  };
};
