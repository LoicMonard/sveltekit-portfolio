import { writable } from 'svelte/store';

let defaultTheme = 'light';

if (typeof window !== 'undefined') {
	const storedTheme = localStorage.getItem('theme');
	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
	defaultTheme = storedTheme || (prefersDark ? 'dark' : 'light');
}

export const theme = writable(defaultTheme);

if (typeof window !== 'undefined') {
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
}
