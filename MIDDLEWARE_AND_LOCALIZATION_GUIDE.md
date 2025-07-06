# Middleware and Localization System Guide

This document provides a complete guide to recreate the modular middleware system and Next.js internationalization setup used in this project.

## Architecture Overview

### 1. Modular Middleware System
- **Composable middleware chain**: Multiple middleware functions executed in sequence
- **Early termination**: Any middleware can return a response to stop the chain
- **Type-safe**: Proper TypeScript interfaces for middleware functions

### 2. Internationalization System
- **Route-based localization**: URL segments like `/en/` and `/ar/`
- **Dynamic message loading**: JSON files for each locale
- **RTL support**: Ready for right-to-left languages like Arabic
- **Type-safe navigation**: Wrapped Next.js navigation APIs

## Setup Instructions

### Step 1: Install Dependencies

```bash
npm install next-intl @formatjs/intl-localematcher
npm install @types/negotiator negotiator
```

### Step 2: Project Structure

Create the following directory structure:

```
src/
├── middleware.ts                          # Main middleware entry point
├── i18n/
│   ├── routing.ts                        # Locale configuration
│   ├── request.ts                        # Request configuration for next-intl
│   └── navigation.ts                     # Type-safe navigation wrappers
├── app/
│   ├── middleware/
│   │   ├── AuthenticationMiddleware.ts   # Auth middleware
│   │   └── LocalizationMiddleware.ts     # i18n middleware
│   ├── [locale]/                         # Locale-based routing
│   │   ├── layout.tsx                    # Locale layout with provider
│   │   └── page.tsx                      # Locale-specific pages
│   └── layout.tsx                        # Root layout
dictionary/
├── en.json                               # English translations
├── ar.json                               # Arabic translations
└── [locale].json                         # Additional locales
```

### Step 3: Core Files Implementation

#### 3.1 Main Middleware (`src/middleware.ts`)

```typescript
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

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
```

#### 3.2 Internationalization Configuration

**`src/i18n/routing.ts`**
```typescript
import {defineRouting} from 'next-intl/routing';
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'ar'],
 
  // Used when no locale matches
  defaultLocale: 'en'
});
```

**`src/i18n/request.ts`**
```typescript
import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './routing';
 
export default getRequestConfig(async ({requestLocale}) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
    
    return {
        locale,
        messages: (await import(`../../dictionary/${locale}.json`)).default
    };
});
```

**`src/i18n/navigation.ts`**
```typescript
import {createNavigation} from 'next-intl/navigation';
import {routing} from './routing';
 
// Lightweight wrappers around Next.js' navigation
// APIs that consider the routing configuration
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
```

#### 3.3 Middleware Components

**`src/app/middleware/AuthenticationMiddleware.ts`**
```typescript
import { NextRequest, NextResponse } from "next/server";

export default async function AuthenticationMiddleware (request: NextRequest) {
    // Example: Protect dashboard routes
    if (request.nextUrl.pathname.includes('dashboard')) {
        // Add your authentication logic here
        // return NextResponse.redirect(new URL('/auth', request.url));
    }
    
    // Return nothing to continue to next middleware
}
```

**`src/app/middleware/LocalizationMiddleware.ts`**
```typescript
import { NextRequest } from "next/server";
import { routing } from '@/i18n/routing';
import createMiddleware from 'next-intl/middleware';

export default async function LocalizationMiddleware(request: NextRequest) {
    const intlMiddleware = createMiddleware(routing);
    return intlMiddleware(request);
}
```

#### 3.4 Layout Configuration

**`src/app/[locale]/layout.tsx`**
```tsx
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import {getMessages} from 'next-intl/server';

export default async function Layout({ 
    children,
    params 
}: {
    children: React.ReactNode
    params: Promise<{locale: string}>
}) {
    const {locale} = await params;
    
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }
    
    // Provide messages to the client
    const messages = await getMessages();
    
    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
        </NextIntlClientProvider>
    );
}
```

**`next.config.ts`**
```typescript
import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  /* config options here */
};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
export default withNextIntl(nextConfig);
```

#### 3.5 Translation Files

**`dictionary/en.json`**
```json
{
  "HomePage": {
    "title": "Hello world!",
    "about": "Go to the about page"
  },
  "Navigation": {
    "home": "Home",
    "dashboard": "Dashboard"
  }
}
```

**`dictionary/ar.json`**
```json
{
  "HomePage": {
    "title": "مرحبا ايها العالم",
    "about": "اذهب إلى صفحة حول"
  },
  "Navigation": {
    "home": "الرئيسية",
    "dashboard": "لوحة التحكم"
  }
}
```

## Usage Examples

### 1. Using Translations in Components

```tsx
import {useTranslations} from 'next-intl';

export default function HomePage() {
  const t = useTranslations('HomePage');
 
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('about')}</p>
    </div>
  );
}
```

### 2. Type-Safe Navigation

```tsx
import {Link} from '@/i18n/navigation';

export default function Navigation() {
  return (
    <nav>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/profile">Profile</Link>
    </nav>
  );
}
```

### 3. Adding New Middleware

To add a new middleware (e.g., rate limiting):

1. Create `src/app/middleware/RateLimitMiddleware.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server";

export default async function RateLimitMiddleware(request: NextRequest) {
    // Rate limiting logic here
    const ip = request.ip || 'unknown';
    
    // Check rate limit for IP
    // if (isRateLimited(ip)) {
    //     return NextResponse.json(
    //         { error: 'Rate limit exceeded' }, 
    //         { status: 429 }
    //     );
    // }
}
```

2. Add to middleware chain in `src/middleware.ts`:
```typescript
import RateLimitMiddleware from './app/middleware/RateLimitMiddleware';

const middlewares: MiddlewareFunction[] = [
  RateLimitMiddleware,        // Add before auth
  AuthenticationMiddleware,
  LocalizationMiddleware
];
```

## Key Features

### Modular Middleware System
- **Sequential execution**: Middlewares run in order until one returns a response
- **Type safety**: All middlewares follow the same interface
- **Easy to extend**: Add new middleware by creating a file and adding to the array
- **Early termination**: Any middleware can stop the chain by returning a response

### Internationalization
- **Route-based**: URLs like `/en/dashboard` and `/ar/dashboard`
- **Server-side**: Messages loaded on the server for better SEO
- **Type-safe**: Navigation APIs are wrapped for locale awareness
- **Flexible**: Easy to add new locales by adding translation files

### Benefits
1. **Separation of concerns**: Each middleware handles one responsibility
2. **Maintainable**: Easy to add, remove, or modify individual middlewares
3. **Testable**: Each middleware can be tested independently
4. **Scalable**: Supports adding more locales and middleware as needed
5. **Performance**: Server-side translation loading with client hydration

This architecture provides a solid foundation for any Next.js project requiring internationalization and modular request processing.
