export type DiscountHistory = {
	id: number;
	productId: number;
	price: number;
	date: Date;
};

export type DiscountHistoryWithoutId = Omit<DiscountHistory, 'id'>;
