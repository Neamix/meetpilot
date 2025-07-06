import next from 'next'
import { NextResponse, NextRequest } from 'next/server'
import AuthenticationMiddleware from './app/middleware/AuthenticationMiddleware'
import LocalizationMiddleware from './app/middleware/LocalizationMiddleware';
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
// Define the middleware type
type MiddlewareFunction = (request: NextRequest) => Promise<NextResponse | void>;

// Register your middleware functions here
const middlewares: MiddlewareFunction[] = [
  AuthenticationMiddleware,
  LocalizationMiddleware
];


export async function middleware(request: NextRequest) {
  for (const middlewareFunction of middlewares) {
    const result = await middlewareFunction(request);
    if (result) {
      return result;
    }
  }
  
  return NextResponse.next();
}


export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};