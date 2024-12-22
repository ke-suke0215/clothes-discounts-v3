import { Link } from '@remix-run/react';
import { type Product } from '~/backend/domain/models/product';

export function ProductCard({ product }: { product: Product }) {
	return (
		<Link key={product.id} to={`/products/${product.id}`} className="block">
			<div className="overflow-hidden rounded-lg border border-gray-200 transition-shadow duration-300 hover:shadow-lg">
				<img
					src={product.imageUrl}
					alt={product.name}
					className="h-90 w-full object-cover"
				/>
				<div className="p-4">
					<h2 className="text-l mb-2">{product.name}</h2>
				</div>
			</div>
		</Link>
	);
}
