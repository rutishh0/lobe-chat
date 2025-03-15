import { Flexbox } from 'react-layout-kit';
import { useGlobalStore } from '@/store/global/store';
import InitClientDB from '@/features/InitClientDB';

import { LayoutProps } from '../type';
import SessionPanel from './SessionPanel';

const Layout = ({ children, session }: LayoutProps) => {
  const showSessionPanel = useGlobalStore((s) => s.status.showSessionPanel);

  return (
    <>
      <Flexbox
        height={'100%'}
        horizontal
        style={{ maxWidth: '100%', overflow: 'hidden', position: 'relative' }}
        width={'100%'}
      >
        {showSessionPanel && <SessionPanel>{session}</SessionPanel>}
        <Flexbox 
          flex={1} 
          style={{ 
            overflow: 'hidden', 
            position: 'relative',
            background: '#000000',
          }}
        >
          {children}
        </Flexbox>
      </Flexbox>
      <InitClientDB bottom={60} />
    </>
  );
};

Layout.displayName = 'DesktopChatLayout';

export default Layout;
