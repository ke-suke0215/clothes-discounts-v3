import { Form } from '@remix-run/react';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { Button } from '~/components/ui/button';

const categoryRadios = [
	{ value: '0', label: 'All' },
	{ value: '1', label: 'Women' },
	{ value: '2', label: 'Men' },
] as const;

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
			<RadioGroup
				defaultValue="0"
				name="category"
				className="mb-6 flex space-x-4"
			>
				{categoryRadios.map(category => (
					<div key={category.value} className="flex items-center space-x-2">
						<RadioGroupItem value={category.value} id={category.value} />
						<Label htmlFor={category.value}>{category.label}</Label>
					</div>
				))}
			</RadioGroup>
		</Form>
	);
}
