import { ActionFunctionArgs, json } from '@remix-run/cloudflare';
import { InsertProductDiscountsForm } from '~/backend/application/dto/insert-product-discount-form';
import InsertProductDiscountService from '~/backend/application/insert-product-discounts-serivce';

// POST /api/insert-product-discount
export const action = async ({ request, context }: ActionFunctionArgs) => {
	const form: InsertProductDiscountsForm = await request.json();

	try {
		const resolvedContext = await context;
		const service = new InsertProductDiscountService(resolvedContext.db);
		await service.execute(form);

		return json({ form });
	} catch (error) {
		console.error('Failed to load products:', error);
		throw new Response('Internal Server Error', { status: 500 });
	}

	// サービス呼び出しなどの処理
};
