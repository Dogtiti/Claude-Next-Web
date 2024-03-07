import type { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/react';
import plugin from 'tailwindcss/plugin';

const config: Config = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			colors: {
				'000': '#f8f8f7',
				100: '#f4f3ee',
				200: '#f0eee5',
				300: '#e7e4d7',
				400: '#ded8c4',
				500: '#c9c0a1',
				'accent-main-000': '#aa5234',
				'accent-main-100': '#ba5a37',
				'accent-main-200': '#c96342',
				'text-000': '#0e0e0d',
				'text-100': '#28261b',
				'text-200': '#3c3929',
				'text-300': '#535045',
				'text-400': '#646257',
				'text-500': '#737063',
			},
		},
	},
	plugins: [
		nextui(),
		plugin(function ({ addUtilities, theme }) {
			addUtilities({
				'.flex-center': {
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				},
				'.from-bg-claude-300': {
					'--tw-gradient-from': `${theme('colors.claude.300')}`,
					'--tw-gradient-to': `${theme('colors.claude.400')}`,
					'--tw-gradient-stops': `var(--tw-gradient-from), var(--tw-gradient-to)`,
				},
			});
		}),
	],
};
export default config;
