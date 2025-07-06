import { NextRequest, NextResponse } from "next/server";

export default async function AuthenticationMiddleware (request: NextRequest) {
    if (request.nextUrl.pathname.includes('dashboard')) {
        // return NextResponse.redirect(new URL('/', request.url));
    }
}