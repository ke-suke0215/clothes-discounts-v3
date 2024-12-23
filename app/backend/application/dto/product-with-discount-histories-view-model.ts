import { Product } from '../../domain/models/product';
import { DiscountHistory } from '../../domain/models/discount-history';
import { format } from 'date-fns';

export type ProductWithDiscountHistoriesViewModel = Product & {
	discountHistories: DiscountHistoryViewModel[];
};

type DiscountHistoryViewModel = {
	id: number;
	productId: number;
	price: number;
	date: string;
};

export const buildProductWithDiscountHistories = (
	product: Product,
	discountHistories: DiscountHistory[],
): ProductWithDiscountHistoriesViewModel => {
	return {
		...product,
		discountHistories: discountHistories.map(dh => ({
			id: dh.id,
			productId: dh.productId,
			price: dh.price,
			date: format(dh.date, 'yyyy-MM-dd'),
		})),
	};
};
