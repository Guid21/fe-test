import type { IncomingWebSocketMessage } from '../test-task-types';

type Listener = (msg: IncomingWebSocketMessage) => void;

class WSManager {
  private ws: WebSocket | null = null;
  private listeners = new Set<Listener>();
  private queue: string[] = [];
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private manualClose = false;
  private connectionId = 0;

  private log(...args: unknown[]) {
    // console.log('[WS]', ...args);
  }

  async connect(url: string) {
    if (this.ws) return;

    this.manualClose = false;
    this.connectionId += 1;
    const cid = this.connectionId;

    this.ws = new WebSocket(url);
    this.log(`connect start #${cid}`);

    this.ws.addEventListener('open', () => {
      this.log(`open #${cid}`, {
        reconnectAttempts: this.reconnectAttempts,
        queued: this.queue.length,
        listeners: this.listeners.size,
      });
      this.reconnectAttempts = 0;

      this.queue.forEach((m) => this.ws?.send(m));
      this.queue = [];

      this.onOpenCallbacks.forEach((cb) => {
        try {
          cb();
        } catch (e) {
          console.error('onOpen cb error', e);
        }
      });
    });

    this.ws.addEventListener('message', async (ev) => {
      try {
        const data = await this.normalizeMessageData(ev.data);
        const msg = JSON.parse(data);
        this.listeners.forEach((cb) => cb(msg));
      } catch (e) {
        console.error('WS parse error', e, ev.data);
      }
    });

    this.ws.addEventListener('error', (ev) => {
      this.log(`error #${cid}`, ev);
    });

    this.ws.addEventListener('close', (ev) => {
      this.log(`close #${cid}`, {
        code: ev.code,
        reason: ev.reason,
        wasClean: ev.wasClean,
        manualClose: this.manualClose,
      });

      this.ws = null;
      if (this.manualClose) return;

      const timeout = Math.min(1000 * 2 ** this.reconnectAttempts, 15000);
      this.reconnectTimer = setTimeout(() => this.connect(url), timeout);
      this.reconnectAttempts++;
      this.log(
        `schedule reconnect in ${timeout}ms, attempts=${this.reconnectAttempts}`,
      );
    });
  }

  disconnect() {
    this.manualClose = true;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.ws?.close();
    this.ws = null;

    this.queue = [];
    this.reconnectAttempts = 0;
    this.log('manual disconnect');
  }

  send(obj: unknown) {
    const str = JSON.stringify(obj);
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(str);
      this.log('send immediate', str);
    } else {
      this.queue.push(str);
      this.log('queue send', { queued: this.queue.length });
    }
  }

  onMessage(cb: Listener) {
    this.listeners.add(cb);
    this.log('onMessage add; count=', this.listeners.size);
    return () => {
      this.listeners.delete(cb);
      this.log('onMessage remove; count=', this.listeners.size);
    };
  }

  private onOpenCallbacks = new Set<() => void>();
  onOpen(cb: () => void) {
    this.onOpenCallbacks.add(cb);
    return () => this.onOpenCallbacks.delete(cb);
  }

  private persistentSends: string[] = [];
  sendPersistent(obj: unknown) {
    const str = JSON.stringify(obj);
    this.persistentSends.push(str);
    this.send(obj);
  }

  private async normalizeMessageData(data: unknown): Promise<string> {
    if (typeof data === 'string') return data;
    if (data instanceof Blob) return await data.text();
    if (data instanceof ArrayBuffer) return new TextDecoder().decode(data);
    if (
      data &&
      typeof data === 'object' &&
      'data' in data &&
      typeof data.data === 'string'
    ) {
      return data.data;
    }
    throw new Error('Unsupported WS message data type');
  }
}

export const wsManager = new WSManager();
