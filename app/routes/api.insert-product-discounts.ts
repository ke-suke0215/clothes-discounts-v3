import { ActionFunctionArgs, json } from '@remix-run/cloudflare';
import { InsertProductDiscountsForm } from '~/backend/application/dto/insert-product-discount-form';

// POST /api/insert-product-discount
export const action = async ({ request }: ActionFunctionArgs) => {
	const formData = await request.formData();
	const name = formData.get('name');
	// form を InsertProductDiscountsForm に変換してserivce呼び出し
	return json({ name });
};
