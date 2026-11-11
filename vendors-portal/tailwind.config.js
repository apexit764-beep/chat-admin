import adminConfig from '../tailwind.config.js';
import { fileURLToPath } from 'node:url';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));

/** Same theme as the admin, scanning both the portal and the shared admin components */
export default {
  ...adminConfig,
  content: [here('./index.html'), here('./src/**/*.{ts,tsx}'), here('../src/components/ui/**/*.{ts,tsx}')],
};
