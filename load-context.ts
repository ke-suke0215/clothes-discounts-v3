import { type AppLoadContext } from '@remix-run/cloudflare';
import { type PlatformProxy } from 'wrangler';
import { connection } from './app/database/client';

type Cloudflare = Omit<PlatformProxy<Env>, 'dispose'> & {
	caches:
		| PlatformProxy<Env, IncomingRequestCfProperties>['caches']
		| CacheStorage;
};

declare module '@remix-run/cloudflare' {
	interface AppLoadContext {
		cloudflare: Cloudflare;
		db: Awaited<ReturnType<typeof connection>>;
	}
}

type args = {
	request: Request;
	context: {
		cloudflare: Cloudflare;
	};
};
type GetLoadContext = (args: args) => Promise<AppLoadContext>;

export const getLoadContext: GetLoadContext = async ({ context }) => {
	return {
		...context,
		db: await connection(context.cloudflare.env.DATABASE),
	};
};
