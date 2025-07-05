import { cookies } from "next/headers";
import { NextRequest } from "next/server";

// Constants for better performance - avoid recreating on each request
const STATIC_PATHS = ['/favicon.ico', '/.well-known', '/avatars/shadcn.jpg', '/_next'];

export default async function (request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    
    if (STATIC_PATHS.some(path => pathname.startsWith(path))) {
        return;
    }

    const cookiesStore = await cookies();
    const language = cookiesStore.get('language') ?? 'en';
    
    
}