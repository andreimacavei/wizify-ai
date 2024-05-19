"use server"
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/authOptions";
import { prisma } from "@/lib/db/db";
import { sanitizeString } from "@/utils/sanitize";
import axios from 'axios';
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

  // For now we have to run 2 queries to check if domain exists and, if not, to add it
  // This is because we can't use upsert with unique constraints
  // See more here: https://github.com/prisma/prisma/issues/5436
  let existingDomains;
  try {
    existingDomains = await prisma.domains.findMany({
      where: {
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

  // Check if user is allowed to add more domains
  const subscription = await prisma.subscription.findUnique({
    where: {
      userId: session.user.id,
    },
    include: {
      plan: {
        select: {
          domainsAllowed: true
        }
      }
    }
  });

  if (!subscription || !subscription.plan) {
    return {
      status: 'error',
      msg: 'No subscription plan found!'
    }
  }

  if (existingDomains.length >= subscription.plan.domainsAllowed) {
    return {
      status: 'error',
      msg: 'You have reached the maximum number of domains allowed for your subscription plan'
    }
  }
    
  // Save domain to main database 
  const hostname = url.hostname;

  const existingDomain = existingDomains.find((domain) => domain.hostname === hostname);

  if (existingDomain) {
    return {
      status: 'error',
      msg: 'Domain already existing!'
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
    console.log('result delete domain: ', result);

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
  console.log("Created new subscription : ", planType, userId)
  let subscription;
  let plan;

  // Retrieve plan id
  try {
    plan = await prisma.plan.findUnique({
      where: {
        name: planType
      }
    });

    if (!plan) {
      throw new Error('Plan not found');
    }

  } catch (error) {
    console.log('error getting plan: ', error);
    return false;
  }

  // Create subscription
  try {
    subscription = await prisma.subscription.create({
      data: {
        planId: plan.id,
        userId,
        credits: plan.creditsPerMonth,
      }
    });

  } catch (error) {
    console.log('error creating subscription: ', error);
    return false;
  }

  // Create widget
  let widget;
  try {
    widget = await prisma.widget.create({
      data: {
        userId,
        subscriptionId: subscription.id,
        config: {},
        domainPrompt: null
        // No need to populate widgetOptions here
      }
    });
  } catch (error) {
    console.log('error creating widget: ', error);
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
        activeKey: userKey,
        userKeys: {
          create: {
            key: userKey
          }
        },
        subscription: {
          connect: {
            id: subscription.id
          }
        },
        subscriptionId: subscription.id,
        widget: {
          connect: {
            id: widget.id
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

export async function createUserSignUpRequest(name, email, details) {
  'use server';
  console.log("Creating new user signup request : ", name);

  try {
    await prisma.userSignupRequest.create({
      data: {
        name: name,
        email: email,
        details: details,
        status: "PENDING"
      }
    });
    return { success: true };
  } catch (error) {
    console.log('error creating the signup request: ', error);
    if (error.code === 'P2002' && error.meta.target.includes('email')) {
      return { success: false, error: "An account sign up request for " + email + " already exists!" };
    }
    return { success: false, error: error.message };
  }
}



export async function validateDomainAndUserKey(
  domains: any[],
  userkey: string
) {
  'use server';

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
  // console.log('validatedDomain: ', validatedDomain);
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

export async function registerApiKey(data: FormData) {
  'use server'
  // Get user session token
  const session = await getServerSession(authOptions);
  if (!session || !session.user)
    throw new Error('User not logged in')
  
  // Get form data
  let key = data.get('apikey') as string;
  let description = data.get('description') as string || '';


  // Check if key exists already
  const existingKey = await prisma.apiKey.findUnique({
    where: {
      key
    }
  });

  if (existingKey) {
    return {
      status: 'error',
      msg: 'API Key already exists'
    }
  }
  // Save key to main database 
  let newKey;
  try {
    newKey = await prisma.apiKey.create({
      data: {
        key,
        userId: session.user.id,
        description
      }
    });

  } catch (error) {
    console.log('error postgres: ', error);
    return {
      status: 'error',
      msg: error
    }
  }

  return {status: 'success', msg: 'API Key added successfully', data: newKey};
}

export async function getUserApiKeys(userId: string) {
  'use server';
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return null;

  const { user } = session;
  
  if (!user) {
    return null;
  }
  
  const apiKeys = await prisma.apiKey.findMany(
    {
      where: {
        userId: user.id
      }
    }
  );

  if (!apiKeys) {
    return [];
  }

  return apiKeys;
}

export async function deleteApiKey(key: string) {
  'use server';
  let result;
  try {
    result = await prisma.apiKey.delete({
      where: {
        key
      }
    });

  } catch (error) {
    console.log('error deleting api key: ', error);
    return false;
  }

  return true;
}

export async function updateKey(key: string, params: {}) {
  'use server';
  let result;
  try {
    result = await prisma.apiKey.update({
      where: {
        key
      },
      data: params
    });

  } catch (error) {
    console.log('error updating api key: ', error);
    return false;
  }
  return true;
}


export async function validateApiKey(apiKey: string) {
  'use server'
  const config = {
    headers: { Authorization: `Bearer ${apiKey}` },
    url: 'https://api.openai.com/v1/engines',
    method: 'get'
  };

  try {
    const response = await axios(config);
    if (response.status === 200) {
      return {
        status: 'success',
        msg: "API key is valid."
      }
    } else {
      return {
        status: 'error',
        msg: "API key is invalid. Status error: " + response.status
      }
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return {
        status: 'error',
        msg: "API key is invalid. Status error: " + error.response.status
      }
    } else {
      return {
        status: 'error',
        msg: "An error occurred: " + error.message
      }
    }
  }

}
