import { GenderEnum } from '~/backend/domain/models/gender';

export type ProductType = {
	id: number;
	productCode: string;
	name: string;
	gender: GenderEnum;
	officialUrl: string;
	imageUrl: string;
};
