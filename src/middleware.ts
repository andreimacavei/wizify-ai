import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';
import { client } from './lib/redis'

const ratelimit = new Ratelimit({
  redis: kv,
  // 5 requests from the same IP in 10 seconds
  limiter: Ratelimit.slidingWindow(5, '10 s'),
});

// Define which routes you want to rate limit
export const config = {
  matcher: '/api/:path*',
};

export default async function middleware(request: NextRequest) {
  console.log("****** new request ******")
  // console.log('request.url:', request.nextUrl.pathname)
  // if (request.nextUrl.pathname.startsWith("/auth")) {
  //   if (request.cookies.get("email_address")) {
  //     console.log("user is authenticated")
  //     return NextResponse.redirect(new URL("/", request.url));
  //   }
  // }

  // Limit the rate of requests
  const ip = request.ip ?? '127.0.0.1';
  const { success, pending, limit, reset, remaining } = await ratelimit.limit(
    ip
  );

  if (!success) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, {
      status: 429,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString(),
      },
    });
  }
  // Check if the request is coming from a whitelisted domain
  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')

  if (!origin && !referer) {
    return NextResponse.json({ error: 'Origin or Referer header is required' }, {
      status: 403,
    });
  }

  const urlOrigin = new URL(origin ?? referer).origin;
  
  console.log('urlOrigin:', urlOrigin)

  const whitelistedDomains = await client.smembers('domains');
  console.log('whitelistedDomains:', whitelistedDomains)

  if (!whitelistedDomains.includes(urlOrigin)) {
    return NextResponse.json({ error: 'Origin or Referer is not allowed' }, {
      status: 401,
      headers: {
        'Access-Control-Allow-Origin': urlOrigin,
      },
    });
  }

  //TODO check for subscription status

  const response = NextResponse.next();
  // Set the Access-Control-Allow-Origin header for CORS issues
  response.headers.set('Access-Control-Allow-Origin', urlOrigin);
  return response;
}