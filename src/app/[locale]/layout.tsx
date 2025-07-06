import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import {getMessages} from 'next-intl/server';

export default async function Layout({ children,params }:
    {
        children: React.ReactNode
        params: Promise<{locale:string}>
    }
) {
    const {locale} = await params;
    console.log('Layout locale:', locale);
    
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }
    
    // Provide messages to the client
    const messages = await getMessages();
    
    return (
        <>
            <main>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    {children}
                </NextIntlClientProvider>
            </main>
        </>
    )
}
