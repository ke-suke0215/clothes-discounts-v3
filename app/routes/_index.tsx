import {
	type LoaderFunction,
	type LoaderFunctionArgs,
	json,
} from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { SearchForm } from '~/components/search-form';
import { ProductList } from '~/components/product-list';
import { type Product } from '~/backend/domain/models/product';
import GetProductsByDiscountDateService from '~/backend/application/get-products-by-discount-date-service';

export const loader: LoaderFunction = async ({
	context,
}: LoaderFunctionArgs) => {
	try {
		const resolvedContext = await context;
		const service = new GetProductsByDiscountDateService(resolvedContext.db);
		const products: Product[] = await service.execute(new Date());

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
		<div className="container mx-auto max-w-5xl p-6 pt-10">
			<h1 className="mb-6 text-2xl">今日の割引商品</h1>
			<SearchForm />
			<ProductList products={products} />
		</div>
	);
}
