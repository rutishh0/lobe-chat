'use client';

import { useTheme } from 'antd-style';
import dynamic from 'next/dynamic';
import { PropsWithChildren, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { BANNER_HEIGHT } from '@/features/AlertBanner/CloudBanner';
import { usePlatform } from '@/hooks/usePlatform';
import { featureFlagsSelectors, useServerConfigStore } from '@/store/serverConfig';
import { GlobalStore, useGlobalStore } from '@/store/global/store';

import SideBar from './SideBar';

const CloudBanner = dynamic(() => import('@/features/AlertBanner/CloudBanner'));

const Layout = memo<PropsWithChildren>(({ children }) => {
  const { isPWA } = usePlatform();
  const theme = useTheme();
  const { showCloudPromotion } = useServerConfigStore(featureFlagsSelectors);
  const showSidebar = useGlobalStore((s: GlobalStore) => s.status.showChatSideBar);

  return (
    <>
      {showCloudPromotion && <CloudBanner />}
      <Flexbox
        height={showCloudPromotion ? `calc(100% - ${BANNER_HEIGHT}px)` : '100%'}
        horizontal
        style={{
          borderTop: isPWA ? `1px solid ${theme.colorBorder}` : undefined,
          position: 'relative',
          background: '#000000',
        }}
        width={'100%'}
      >
        {showSidebar && <SideBar />}
        <Flexbox flex={1}>{children}</Flexbox>
      </Flexbox>
    </>
  );
});

Layout.displayName = 'DesktopMainLayout';

export default Layout;
