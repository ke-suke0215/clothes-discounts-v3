import { ActionFunctionArgs, json } from '@remix-run/cloudflare';

// POST /api/insert-product-discount
export const action = async ({ request }: ActionFunctionArgs) => {
	console.log('request', request);
	const formData = await request.formData();
	const name = formData.get('name');
	return json({ name });
};
