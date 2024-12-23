import type { ProductWithDiscountHistoriesViewModel } from '~/backend/application/dto/product-with-discount-histories-view-model';

import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Calendar } from '~/components/ui/calendar';
import { PageBreadcrumb } from '~/components/page-breadcrumb';
import GetProductByIdService from '~/backend/application/get-product-by-id-service';
import invariant from 'tiny-invariant';
import { ApplicationError } from '~/backend/errors/application-error';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
	invariant(params.id, 'Missing id param');
	const productId = parseInt(params.id);

	console.log('id:', productId);
	try {
		const product = await new GetProductByIdService(await context.db).execute(
			productId,
		);
		return json({ product });
	} catch (error) {
		console.error('Failed to load products:', error);

		if (error instanceof ApplicationError) {
			throw new Response(error.message, { status: error.status });
		} else {
			throw new Response('Internal Server Error', { status: 500 });
		}
	}
};

export default function ProductDetail() {
	const { product } = useLoaderData<typeof loader>() as {
		product: ProductWithDiscountHistoriesViewModel;
	};

	const selectedDates = product.discountHistories.map(
		history => new Date(history.date),
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
									{product.discountHistories.map(history => (
										<tr key={history.date}>
											<td className="py-3">
												{format(new Date(history.date), 'yyyy年MM月dd日', {
													locale: ja,
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
