'use client';

import dynamic from 'next/dynamic';
import { PropsWithChildren, memo } from 'react';
import { withSuspense } from '@/components/withSuspense';
import { useGlobalStore } from '@/store/global/store';
import { featureFlagsSelectors, useServerConfigStore } from '@/store/serverConfig';

const CloudBanner = dynamic(() => import('@/features/AlertBanner/CloudBanner'));

const Layout = memo(({ children }: PropsWithChildren) => {
  const { showCloudPromotion } = useServerConfigStore(featureFlagsSelectors);
  const showNav = useGlobalStore((s) => s.status.showChatSideBar);

  return (
    <>
      {showCloudPromotion && <CloudBanner mobile />}
      <div style={{ 
        height: '100%',
        background: '#000000',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {children}
      </div>
    </>
  );
});

Layout.displayName = 'MobileMainLayout';

export default withSuspense(Layout);
