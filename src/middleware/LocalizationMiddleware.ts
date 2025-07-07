import { NextRequest } from "next/server";

import { routing } from '@/i18n/routing';
import createMiddleware from 'next-intl/middleware';

export default async function LocalizationMiddleware(request: NextRequest) {
    const intlMiddleware = createMiddleware(routing);
    return intlMiddleware(request);
}