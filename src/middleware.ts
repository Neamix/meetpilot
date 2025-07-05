import next from 'next'
import { NextResponse, NextRequest } from 'next/server'
import AuthenticationMiddleware from './app/middleware/AuthenticationMiddleware'
import LocalizationMiddleware from './app/middleware/LocalizationMiddleware';

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