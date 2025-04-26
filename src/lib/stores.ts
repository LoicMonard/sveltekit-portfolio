import { writable } from 'svelte/store';

export const activeCard = writable<string | null>(null);
