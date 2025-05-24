/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: ['bg-light-pattern'], // <- ajoute ceci
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				pastel: {
					yellow: '#FFF582',
					white: '#F9F9F6'
				},
				text: {
					light: '#334155',
					dark: '#d6d6d6'
				},
				// accent: {
				// 	beige: '#F3EED9',
				// 	sage: '#DCE5D1'
				// },
				background: {
					light: '#FFF582',
					dark: '#333333'
				},
				primary: {
					light: '#F3EED9',
					dark: '#DCE5D1'
				},
				accent: {
					yellow: '#FFF582',
					green: '#A3D9A5'
				},
				border: {
					light: '#E3E8F0',
					dark: '#333333'
				},
				surface: {
					light: '#fcfdff',
					lighthover: '#f5f8ff',
					dark: '#1E1E1E',
					darkhover: '#333333'
				}
			},
			backgroundImage: {
				'light-pattern':
					'repeating-linear-gradient(90deg,#f9f9f6 0px,#f9f9f6 20px,#fcfcfa 20px,#fcfcfa 40px)'
			}
		}
	},
	plugins: []
};
