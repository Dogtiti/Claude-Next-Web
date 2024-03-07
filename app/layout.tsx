import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from './providers';
import classnames from 'classnames';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Claude Next Web',
	description: 'One click to deploy your own claude web',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' className='h-full'>
			<body className={classnames(inter.className, 'h-full')}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
