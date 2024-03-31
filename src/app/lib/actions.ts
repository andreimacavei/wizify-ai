"use server"
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/authOptions";
import { prisma } from "@/lib/db/db";
import { sanitizeString } from "@/utils/sanitize";
// import { client } from "@/lib/redis";

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
  console.log('domain URL: ', domainURL)

  // Validate URL
  let url;
  try {
    url = new URL(domainURL);
  } catch (error) {
    console.log('Invalid URL:', domainURL)
    return {
      status: 'error',
      msg: 'Invalid URL'
    }
  }
  
  // Save domain to main database 
  const hostname = url.hostname;

  let existingDomain;
  try {
    existingDomain = await prisma.domains.findFirst({
      where: {
        hostname,
        userId: session.user.id
      }
    });
  } catch (error) {
    console.log('error postgres: ', error);
    return {
      status: 'error',
      msg: error
    }
  }

  console.log('existing domain ?: ', existingDomain);
  if (existingDomain) {
    return {
      status: 'error',
      msg: 'Domain already added'
    }
  }

  // If domain does not exist for current user, add it
  let newDomain;
  try {
    newDomain = await prisma.domains.create({
      data: {
        hostname,
        userId: session.user.id
      }
    });
    console.log('new domain postgres: ', newDomain);

  } catch (error) {
    console.log('error postgres: ', error);
    return {
      status: 'error',
      msg: error
    }
  }

  // TODO uncomment this when fxing issue with deletion
  // Save to redis db (edge cache)
  // const result = await client.sadd('domains', hostname);
  // console.log('result redis: ', result);

  return {status: 'success', msg: 'Domain added successfully', data: newDomain};
}

export async function deleteDomain(id: number) {
  'use server'
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

  // TODO uncomment this when fxing issue with deletion
  // Save to redis db (edge cache)
  // result = await client.srem('domains', result.hostname);
  // console.log('result redis: ', result);

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

export async function initUserData(planType: string, userId: string, userKey: string) {
  'use server'
  console.log("addSubscription: ", planType, userId)
  let subscription;
  let plan;

  // Retrieve plan id
  try {
    plan = await prisma.plan.findUnique({
      where: {
        name: planType
      }
    });

  } catch (error) {
    console.log('error getting plan: ', error);
    return false;
  }

  // Create subscription
  try {
    subscription = await prisma.subscription.create({
      data: {
        planId: plan.id,
        userId
      }
    });

  } catch (error) {
    console.log('error creating subscription: ', error);
    return false;
  }

  // Update user data
  let updatedUser;
  try {
    updatedUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        credits: {
          // TODO sanitize this value
          increment: plan.creditsPerMonth
        },
        activeKey: userKey,
        userKeys: {
          create: {
            key: userKey
          }
        }
      }
    });

  } catch (error) {
    console.log('error updating user data: ', error);
    return false;
  }

  return true;
}

export async function validateDomainAndUserKey(
  domains: any[],
  userkey: string
) {
  'use server';

  //TODO refactor and check active key

  // Get user with same userkey
  const userKey = await prisma.userKey.findFirst({
    where: {
      key: userkey
    }
  })
  if (!userKey) {
    return false;
  }
  console.log('userKey: ', userKey);
  // Validate domain is owned by user
  let validatedDomain = null;
  domains.forEach((domain) => {
    if (domain.userId === userKey.userId) {
      validatedDomain = domain;
      return;
    }
  });
  if (!validatedDomain) {
    return validatedDomain;
  }
  console.log('validatedDomain: ', validatedDomain);
  // Validate domain in database so next calls can be faster
  await prisma.domains.update({
    where: {
      id: validatedDomain.id
    },
    data: {
      validated: true
    }
  });

  return validatedDomain;
}

