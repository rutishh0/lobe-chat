import { SpeedInsights } from '@vercel/speed-insights/next';
import { ThemeAppearance } from 'antd-style';
import { ResolvingViewport } from 'next';
import { ReactNode } from 'react';
import { isRtlLang } from 'rtl-detect';
import Script from 'next/script';

import Analytics from '@/components/Analytics';
import { DEFAULT_LANG } from '@/const/locale';
import PWAInstall from '@/features/PWAInstall';
import AuthProvider from '@/layout/AuthProvider';
import GlobalProvider from '@/layout/GlobalProvider';
import { Locales } from '@/locales/resources';
import { DynamicLayoutProps } from '@/types/next';
import { RouteVariants } from '@/utils/server/routeVariants';

const inVercel = process.env.VERCEL === '1';

interface RootLayoutProps extends DynamicLayoutProps {
  children: ReactNode;
  modal: ReactNode;
}

const RootLayout = async ({ children, params, modal }: RootLayoutProps) => {
  const { variants } = await params;

  const { locale, isMobile, theme, primaryColor, neutralColor } =
    RouteVariants.deserializeVariants(variants);

  const direction = isRtlLang(locale) ? 'rtl' : 'ltr';

  return (
    <html dir={direction} lang={locale} suppressHydrationWarning>
      <body>
        <GlobalProvider
          appearance={theme}
          isMobile={isMobile}
          locale={locale}
          neutralColor={neutralColor}
          primaryColor={primaryColor}
        >
          <AuthProvider>
            {children}
            {!isMobile && modal}
          </AuthProvider>
          <PWAInstall />
        </GlobalProvider>
        <Analytics />
        {inVercel && <SpeedInsights />}
        {/* Load the Lobe Chat Plugin bundle from your Vercel-hosted instance */}
        <Script
          src="https://lobe-chat-ashy-tau.vercel.app/sdk.min.js"
          strategy="beforeInteractive"
        />
        {/* Initialize the Lobe Chat Plugin */}
        <Script id="lobe-chat-init" strategy="afterInteractive">
          {`
            if (window.LobeChatPlugin) {
              window.LobeChatPlugin.mount({
                selector: '#lobe-chat-container',
                pluginId: 'your-plugin-id', // Replace with your plugin ID if applicable
                welcomeMessage: 'Welcome to Elevate! How can I help you today?',
                config: {
                  model: 'gemini-2.0-flash',
                  chatTitle: 'Elevate Chat'
                }
              });
            }
          `}
        </Script>
        {/* Container for the chat widget */}
        <div id="lobe-chat-container"></div>
      </body>
    </html>
  );
};

export default RootLayout;

export { generateMetadata } from './metadata';

export const generateViewport = async (props: DynamicLayoutProps): ResolvingViewport => {
  const isMobile = await RouteVariants.getIsMobile(props);

  const dynamicScale = isMobile ? { maximumScale: 1, userScalable: false } : {};

  return {
    ...dynamicScale,
    initialScale: 1,
    minimumScale: 1,
    themeColor: [
      { color: '#f8f8f8', media: '(prefers-color-scheme: light)' },
      { color: '#000', media: '(prefers-color-scheme: dark)' },
    ],
    viewportFit: 'cover',
    width: 'device-width',
  };
};

export const generateStaticParams = () => {
  const themes: ThemeAppearance[] = ['dark', 'light'];
  const mobileOptions = [true, false];
  // only static for several pages, others go to dynamic
  const staticLocales: Locales[] = [DEFAULT_LANG, 'zh-CN'];

  const variants: { variants: string }[] = [];

  for (const locale of staticLocales) {
    for (const theme of themes) {
      for (const isMobile of mobileOptions) {
        variants.push({
          variants: RouteVariants.serializeVariants({ isMobile, locale, theme }),
        });
      }
    }
  }

  return variants;
};
