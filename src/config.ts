const VITE_API_BASE = import.meta.env.DEV ? '/' : import.meta.env.VITE_API_BASE;
// TODO: Sockets are not afraid of corsos
const VITE_WS_URL = import.meta.env.VITE_WS_URL;

export { VITE_API_BASE, VITE_WS_URL };
