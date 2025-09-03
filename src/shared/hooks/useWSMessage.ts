import { useEffect } from 'react';
import type { IncomingWebSocketMessage } from '../test-task-types';
import { wsManager } from '../api/wsManager';

export function useWSMessage(handler: (msg: IncomingWebSocketMessage) => void) {
  useEffect(() => {
    const off = wsManager.onMessage(handler);
    return () => {
      off();
    };
  }, [handler]);
}
