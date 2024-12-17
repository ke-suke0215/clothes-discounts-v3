import { Label } from '~/components/ui/label';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';

export const categories = {
	all: {
		label: 'All',
		value: '0',
	},
	women: {
		label: 'Women',
		value: '1',
	},
	men: {
		label: 'Men',
		value: '2',
	},
} as const;

const categoryRadios = [
	categories.all,
	categories.women,
	categories.men,
] as const;

export function CategoryRadio({
	onChange,
}: {
	onChange: (value: string) => void;
}) {
	return (
		<RadioGroup
			name="category"
			defaultValue="0"
			className="mb-6 flex space-x-4"
			onValueChange={onChange}
		>
			{categoryRadios.map(category => (
				<div key={category.value} className="flex items-center space-x-2">
					<RadioGroupItem value={category.value} id={category.value} />
					<Label htmlFor={category.value}>{category.label}</Label>
				</div>
			))}
		</RadioGroup>
	);
}
