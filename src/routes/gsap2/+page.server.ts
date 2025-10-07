import { dev } from '$app/environment';

// En dev seulement : désactiver SSR pour tester
export const ssr = dev ? false : true;
export const csr = true;
