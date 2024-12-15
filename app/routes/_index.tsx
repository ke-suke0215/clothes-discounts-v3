import { type LoaderFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { SearchForm } from '~/components/search-form';
import { type Product, products } from '~/data/products';
import { ProductCard } from '~/components/product-card';
import { PageBreadcrumb } from '~/components/page-breadcrumb';

export const loader: LoaderFunction = async () => {
	// 実際のAPIやデータベースからデータを取得する代わりに、ダミーデータを使用

	return json({ products });
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
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{products.map((product: Product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</div>
	);
}
