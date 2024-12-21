import {
	type LoaderFunction,
	type LoaderFunctionArgs,
	json,
} from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { SearchForm } from '~/components/search-form';
import { Product } from '~/backend/domain/models/product';
import { ProductList } from '~/components/product-list';
import { ProductType } from '~/types/product';
// 動作確認用
import { ProductRepository } from '~/backend/infrastructure/product-repository';

export const loader: LoaderFunction = async ({
	context,
}: LoaderFunctionArgs) => {
	try {
		// TODO: 別ファイルでDBにアクセスする関数を作成し、それを利用する
		const resolvedContext = await context; // Promiseを解決
		// const products = await resolvedContext.db.product.findMany();

		const repository = new ProductRepository(resolvedContext.db);
		const products: Product[] = await repository.findByIds([1, 10, 20, 30]); // とりあえず固定で取得
		const plainProducts: ProductType[] = products.map(product =>
			product.toPlain(),
		);

		return json({ products: plainProducts });
	} catch (error) {
		console.error('Failed to load products:', error);
		throw new Response('Internal Server Error', { status: 500 });
	}
};

// 当日の割引商品を表示する
export default function Index() {
	const { products } = useLoaderData<typeof loader>() as {
		products: ProductType[];
	};

	return (
		<div className="container mx-auto max-w-5xl p-6 pt-10">
			<h1 className="mb-6 text-2xl">今日の割引商品</h1>
			<SearchForm />
			<ProductList products={products} />
		</div>
	);
}
