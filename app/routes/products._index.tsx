import {
	LoaderFunction,
	LoaderFunctionArgs,
	json,
} from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { SearchForm } from '~/components/search-form';
import { type Product } from '~/data/products';
import { PageBreadcrumb } from '~/components/page-breadcrumb';
import { ProductList } from '~/components/product-list';

export const loader: LoaderFunction = async ({
	context,
}: LoaderFunctionArgs) => {
	try {
		// TODO: 別ファイルでDBにアクセスする関数を作成し、それを利用する
		const resolvedContext = await context; // Promiseを解決
		const products = await resolvedContext.db.product.findMany();
		return json({ products });
	} catch (error) {
		console.error('Failed to load products:', error);
		throw new Response('Internal Server Error', { status: 500 });
	}
};

// 当日の割引商品を表示する
export default function Index() {
	const { products } = useLoaderData<typeof loader>() as {
		products: Product[];
	};

	return (
		<div className="container mx-auto max-w-5xl p-6">
			<PageBreadcrumb currentPage="商品検索" items={[]} />
			<h1 className="mb-6 text-2xl">商品一覧</h1>
			<SearchForm />
			<ProductList products={products} />
		</div>
	);
}
