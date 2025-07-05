import { NextRequest } from "next/server";

export default function LocalizationMiddleware (request: NextRequest) {
    console.log(request.nextUrl.pathname);
}