"use server"
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/authOptions";
import { prisma } from "@/lib/db/db";
import { z } from "zod";
import { client } from "@/lib/redis";

const urlRegex = /^(((http|https):\/\/|)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6}(:[0-9]{1,5})?(\/.*)?)$/;
/* 
 * Register new domain
 */
export async function registerNewDomain(data: FormData) {
  'use server'
  // Get user session token
  const session = await getServerSession(authOptions);
  if (!session || !session.user)
    throw new Error('User not logged in')
  
  // Get form data
  let domainField = data.get('domain') as string;
  const hostname = domainField.trim().toLowerCase();
  
  console.log('hostname: ', hostname)
  const schema = z.object({
    hostname: z.string().regex(urlRegex)
  });

  const validation = schema.safeParse({hostname});
  if (validation.success === false) { 
    let errorArr = [];
    const err = validation.error;
    err.errors.forEach((error) => {
      errorArr.push({
        for: error.path[0],
        message: error.message,
      });
    });
    return {
      status: 'error',
      errors: errorArr
    }
  }
  console.log("user: ", session.user);
  // Save domain to main database
  let result;
  try {
    result = await prisma.domains.create({
      data: {
        hostname,
        userId: session.user.id
      }
    });
    console.log('result postgres: ', result);

  } catch (error) {
    console.log('error postgres: ', error);
    return {
      status: 'error',
      errors: [error]
    }
  }
  

  // Save to redis db (edge cache)
  result = await client.sadd('domains', hostname);
  console.log('result redis: ', result);

  return {status: 'success'};
} 