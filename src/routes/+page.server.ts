import { dev } from '$app/environment';

export const ssr = dev ? false : true;
export const csr = true;
