import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

// When the site is served by Base44 (or the local dev proxy), API calls can use
// relative paths. Anywhere else (e.g. Vercel on stillsbybrooklyn.co.za) they must
// go straight to the Base44 API, otherwise every request 404s on the host.
const isBase44Host =
  typeof window !== 'undefined' && /(^|\.)base44\.(app|com)$/i.test(window.location.hostname);
const useDevProxy = import.meta.env.DEV && !!import.meta.env.VITE_BASE44_APP_BASE_URL;

export const serverUrl =
  import.meta.env.VITE_BASE44_SERVER_URL ||
  (isBase44Host || useDevProxy ? '' : 'https://base44.app');

//Create a client with authentication required
export const base44 = createClient({
  appId,
  token,
  functionsVersion,
  serverUrl,
  requiresAuth: false,
  appBaseUrl
});
