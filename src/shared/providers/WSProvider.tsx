import React, { useEffect } from 'react';
import { VITE_WS_URL } from '@/config';
import { wsManager } from '../api/wsManager';

// TODO: We can make this some context
function WSProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    wsManager.connect(VITE_WS_URL);
    return () => {
      wsManager.disconnect();
    };
  }, []);
  return <>{children}</>;
}

export default WSProvider;
