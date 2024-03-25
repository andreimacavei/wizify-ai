"use server"
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/authOptions";
import { prisma } from "@/lib/db/db";
import { z } from "zod";
import { sanitizeString } from "@/utils/sanitize";
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
  const domainURL = domainField.trim().toLowerCase();
  
  const schema = z.object({
    domainURL: z.string().regex(urlRegex)
  });

  const validation = schema.safeParse({domainURL});
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
  const hostname = new URL(domainURL).hostname;

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

export async function deleteDomain(id: string) {
  'server'
  let result;
  try {
    result = await prisma.domains.delete({
      where: {
        id
      }
    });
    console.log('result postgres: ', result);

  } catch (error) {
    console.log('error postgres: ', error);
    return false;
  }

  // Save to redis db (edge cache)
  result = await client.srem('domains', result.hostname);
  console.log('result redis: ', result);

  return true;
}

/**
 * Update User Profile
 */
export async function updateProfile(data: FormData) {
	'use server'

	// Get user session token
  const session = await getServerSession(authOptions);
	if (!session || !session.user)
		throw new Error('User not logged in')

	// Get posted data
	let name = data.get('name')?.valueOf().toString() || ''

	// Sanitize posted data
	name = sanitizeString( name )

	// Validate posted data
	if ( typeof name !== 'string' || name.length === 0 )
		throw new Error('User Full Name Error');

	return await prisma.user.update({
    where: {
      id: session.user.id
    },
		data: {
			name,
		}
	})
}