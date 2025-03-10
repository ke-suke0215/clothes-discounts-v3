import type { Product } from '~/backend/domain/models/product';

import {
	LoaderFunction,
	LoaderFunctionArgs,
	json,
} from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { SearchForm } from '~/components/search-form';
import GetProductsByNameService from '~/backend/application/get-products-by-name';
import { PageBreadcrumb } from '~/components/page-breadcrumb';
import { ProductList } from '~/components/product-list';

export const loader: LoaderFunction = async ({
	request,
	context,
}: LoaderFunctionArgs) => {
	try {
		const url = new URL(request.url);
		const searchWord = url.searchParams.get('search');
		if (searchWord === null) {
			return json({ products: [] });
		}

		const resolvedContext = await context;
		const service = new GetProductsByNameService(resolvedContext.db);
		const products: Product[] = await service.execute(searchWord);

		// searchWordも返す
		return json({ products, searchWord });
	} catch (error) {
		console.error('Failed to load products:', error);
		throw new Response('Internal Server Error', { status: 500 });
	}
};

// 当日の割引商品を表示する
export default function Index() {
	const { products, searchWord } = useLoaderData<typeof loader>() as {
		products: Product[];
		searchWord: string;
	};

	return (
		<div className="container mx-auto max-w-5xl p-6">
			<PageBreadcrumb currentPage="商品検索" items={[]} />
			<h1 className="mb-6 text-2xl">商品一覧</h1>
			<SearchForm defaultValue={searchWord} />
			{products.length > 0 ? (
				<ProductList products={products} />
			) : (
				<div className="mt-10 text-center text-gray-500">
					商品が見つかりませんでした。
				</div>
			)}
		</div>
	);
}
