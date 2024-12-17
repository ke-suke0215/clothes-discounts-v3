import { useState, useEffect } from 'react';
import { type Product } from '~/data/products';
import { ProductCard } from '~/components/product-card';
import { categories, CategoryRadio } from '~/components/category-radio';

// 当日の割引商品を表示する
export function ProductList({ products }: { products: Product[] }) {
	const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
	const [category, setCategory] = useState<string>('0');

	useEffect(() => {
		if (category === categories.all.value) {
			setFilteredProducts(products);
		} else {
			setFilteredProducts(
				products.filter(
					product =>
						product.gender === parseInt(category) || product.gender === 0,
				),
			);
		}
	}, [category, products]);

	return (
		<div>
			<CategoryRadio onChange={setCategory} />
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{filteredProducts.map((product: Product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</div>
	);
}
