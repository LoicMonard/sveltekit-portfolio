import { writable } from 'svelte/store';

const storedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const defaultTheme = storedTheme || (prefersDark ? 'dark' : 'light');

export const theme = writable(defaultTheme);

theme.subscribe((value) => {
	const root = document.documentElement;
	if (value === 'dark') {
		root.classList.add('dark');
		localStorage.setItem('theme', 'dark');
	} else {
		root.classList.remove('dark');
		localStorage.setItem('theme', 'light');
	}
});
