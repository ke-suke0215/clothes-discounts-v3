import { Form } from '@remix-run/react';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';

export function SearchForm() {
	return (
		<Form method="get" action="/products" className="mb-6">
			<div className="mb-6 flex gap-2">
				<Input
					type="text"
					name="search"
					placeholder="商品を検索..."
					className="focus:outline-none"
				/>
				<Button type="submit">検索</Button>
			</div>
		</Form>
	);
}
