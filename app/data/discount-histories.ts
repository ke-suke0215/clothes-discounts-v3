export type DiscountHistory = {
	product_id: number;
	date: Date;
	price: number;
};

export const discountHistories: DiscountHistory[] = [
	{
		product_id: 1,
		date: new Date('2024-12-01 00:00:00'),
		price: 2990,
	},
	{
		product_id: 1,
		date: new Date('2024-12-03 00:00:00'),
		price: 2990,
	},
	{
		product_id: 1,
		date: new Date('2024-12-05 00:00:00'),
		price: 2990,
	},
	{
		product_id: 1,
		date: new Date('2024-12-07 00:00:00'),
		price: 2990,
	},
	{
		product_id: 1,
		date: new Date('2024-12-09 00:00:00'),
		price: 2990,
	},
];
