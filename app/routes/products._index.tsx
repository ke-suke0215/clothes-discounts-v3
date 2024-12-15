import { LoaderFunctionArgs, json } from '@remix-run/cloudflare';
import { Link, useLoaderData } from '@remix-run/react';
import { SearchForm } from '~/components/search-form';
import { type Product, products } from '~/data/products';
import { PageBreadcrumb } from '~/components/page-breadcrumb';

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url);
	const search = url.searchParams.get('search');
	const category = url.searchParams.get('category');

	console.log({
		url: request.url,
		search,
		category,
	});

	return json({ products });
};

// 当日の割引商品を表示する
export default function Index() {
	const { products } = useLoaderData<typeof loader>();

	return (
		<div className="container mx-auto p-6">
			<PageBreadcrumb currentPage="商品検索" items={[]} />
			<h1 className="mb-6 text-2xl">商品一覧</h1>
			<SearchForm />
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{products.map((product: Product) => (
					<Link
						key={product.id}
						to={`/products/${product.id}`}
						className="block"
					>
						<div className="overflow-hidden rounded-lg border border-gray-200 transition-shadow duration-300 hover:shadow-lg">
							<img
								src={product.imageUrl}
								alt={product.name}
								className="h-90 w-full object-cover"
							/>
							<div className="p-4">
								<h2 className="text-l mb-2">{product.name}</h2>
							</div>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}
