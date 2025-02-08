import { ActionFunctionArgs, json } from '@remix-run/cloudflare';
import { InsertProductDiscountsForm } from '~/backend/application/dto/insert-product-discount-form';
import InsertProductDiscountService from '~/backend/application/insert-product-discounts-serivce';
import { ApplicationError } from '~/backend/errors/application-error';

// POST /api/insert-product-discount
export const action = async ({ request, context }: ActionFunctionArgs) => {
	const form: InsertProductDiscountsForm = await request.json();

	try {
		const resolvedContext = await context;

		// API Key が正しいかチェック
		const actualApiKey = request.headers.get('Insert-Discount-API-Key');
		const expectedApiKey =
			resolvedContext.cloudflare.env.INSERT_DISCOUNT_API_KEY;

		// if (actualApiKey !== expectedApiKey) {
		// 	console.error('Unauthorized. Invalid API Key: ', actualApiKey);
		// 	return new Response('Unauthorized', { status: 401 });
		// }

		const service = new InsertProductDiscountService(resolvedContext.db);
		await service.execute(form);

		return json({ form });
	} catch (error) {
		console.error('Failed to load products:', error);

		if (error instanceof ApplicationError) {
			throw new Response(error.message, { status: error.status });
		} else {
			throw new Response('Internal Server Error', { status: 500 });
		}
	}
};
