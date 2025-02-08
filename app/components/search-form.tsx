import { Form } from '@remix-run/react';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Search } from 'lucide-react';

export function SearchForm({ defaultValue = '' }: { defaultValue?: string }) {
	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		const formData = new FormData(event.currentTarget);
		const searchWord = formData.get('search')?.toString().trim();

		if (!searchWord) {
			event.preventDefault();
		}
	};

	return (
		<Form
			method="get"
			action="/products"
			className="mb-6"
			onSubmit={handleSubmit}
		>
			<div className="flex gap-2">
				<Input
					type="search"
					name="search"
					placeholder="商品名を入力"
					className="focus:outline-none"
					defaultValue={defaultValue}
				/>
				<Button type="submit">
					<Search />
				</Button>
			</div>
		</Form>
	);
}
