/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				pastel: {
					yellow: '#FFF582',
					white: '#F9F9F6'
				},
				text: {
					light: '#6B6B6B',
					dark: '#333333'
				},
				accent: {
					beige: '#F3EED9',
					sage: '#DCE5D1'
				}
			}
		}
	},
	plugins: []
};
