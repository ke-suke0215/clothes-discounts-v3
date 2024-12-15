import type { DiscountHistory } from '~/data/discount-histories';

import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';
import { products } from '~/data/products';
import { Calendar } from '~/components/ui/calendar';
import { PageBreadcrumb } from '~/components/page-breadcrumb';
import { discountHistories } from '~/data/discount-histories';

import invariant from 'tiny-invariant';

export const loader = async ({ params }: LoaderFunctionArgs) => {
	invariant(params.id, 'Missing id param');
	const productId = parseInt(params.id);
	const product = products.find(p => p.id === productId);

	if (!product) {
		throw new Response('商品が見つかりません', { status: 404 });
	}

	return json({ product });
};

export default function ProductDetail() {
	const { product } = useLoaderData<typeof loader>();

	const selectedDates = discountHistories.map(
		(history: DiscountHistory) => history.date,
	);

	return (
		<div className="container mx-auto max-w-5xl p-6">
			<PageBreadcrumb
				currentPage="商品詳細"
				items={[{ label: '商品検索', to: '/products' }]}
			/>
			<div className="flex flex-col gap-8 lg:flex-row">
				<div className="w-full lg:w-1/3">
					<img
						src={product.imageUrl}
						alt={product.name}
						className="mb-4 w-full rounded-lg"
					/>
					<a
						href={product.officialUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-block text-blue-600 hover:underline"
					>
						公式サイトで見る
					</a>
				</div>
				<div>
					<h2 className="mb-6 text-xl lg:text-2xl">{product.name}</h2>
					<div className="flex flex-col gap-8 md:flex-row lg:flex-1">
						<div className="mx-auto rounded-lg bg-white md:mx-0">
							<Calendar
								mode="multiple"
								selected={selectedDates}
								className="w-fit"
							/>
						</div>
						<div className="mx-auto w-[270px] rounded-lg bg-white p-4">
							<h2 className="mb-4 text-lg">割引履歴</h2>
							<table className="w-full">
								<thead>
									<tr className="border-b">
										<th className="pb-2 text-left font-normal">日付</th>
										<th className="pb-2 text-right font-normal">値段</th>
									</tr>
								</thead>
								<tbody className="divide-y">
									{discountHistories.map(history => (
										<tr key={history.date.getTime()}>
											<td className="py-3">
												{history.date.toLocaleDateString('ja-JP', {
													year: 'numeric',
													month: '2-digit',
													day: '2-digit',
												})}
											</td>
											<td className="text-right">
												{history.price.toLocaleString()}円
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
