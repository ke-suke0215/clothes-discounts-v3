import type { LinksFunction } from '@remix-run/cloudflare';
import {
	Outlet,
	Links,
	Meta,
	Scripts,
	ScrollRestoration,
} from '@remix-run/react';
import stylesheet from '~/tailwind.css?url';
import dayPickerStyles from 'react-day-picker/style.css?url';

export const links: LinksFunction = () => [
	{ rel: 'stylesheet', href: stylesheet },
	{ rel: 'stylesheet', href: dayPickerStyles },
	{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
	{
		rel: 'preconnect',
		href: 'https://fonts.gstatic.com',
		crossOrigin: 'anonymous',
	},
	{
		rel: 'stylesheet',
		href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
	},
];

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="ja">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration /> {/* 必要か要検討 */}
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}
