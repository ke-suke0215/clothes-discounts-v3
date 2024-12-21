import { useState, useEffect } from 'react';
import { ProductType } from '~/types/product';
import { ProductCard } from '~/components/product-card';
import { categories, CategoryRadio } from '~/components/category-radio';
import { isForMen, isForWomen } from '~/backend/domain/models/gender';

// 当日の割引商品を表示する
export function ProductList({ products }: { products: ProductType[] }) {
	const [filteredProducts, setFilteredProducts] =
		useState<ProductType[]>(products);
	const [category, setCategory] = useState<string>('0');

	useEffect(() => {
		switch (category) {
			case categories.all.value:
				setFilteredProducts(products);
				break;
			case categories.women.value:
				setFilteredProducts(
					products.filter(product => isForWomen(product.gender)),
				);
				break;
			case categories.men.value:
				setFilteredProducts(
					products.filter(product => isForMen(product.gender)),
				);
				break;
		}
	}, [category, products]);

	return (
		<div>
			<CategoryRadio onChange={setCategory} />
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{filteredProducts.map((product: ProductType) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</div>
	);
}
