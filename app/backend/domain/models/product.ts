import { GenderEnum } from '~/backend/domain/models/gender';

export type Product = {
	id: number;
	productCode: string;
	name: string;
	gender: GenderEnum;
	officialUrl: string;
	imageUrl: string;
};

export type ProductWithoutId = Omit<Product, 'id'>;
