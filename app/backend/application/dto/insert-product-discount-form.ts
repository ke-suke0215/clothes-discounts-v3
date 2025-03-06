import { GenderEnum } from '~/backend/domain/models/gender';
import { ProductWithoutId } from '~/backend/domain/models/product';

export type InsertProductDiscountsForm = {
	productDiscounts: ProductDiscount[];
};

export type ProductDiscount = {
	productCode: string;
	name: string;
	gender: GenderFormEnum;
	officialUrl: string;
	imageUrl: string;
	price: number;
	date: string; // yyyy-MM-dd
};

type GenderFormEnum = Exclude<GenderEnum, GenderEnum.Unisex>;

// 製品の性別をUnisexに変更するかどうか
export const shouldUpdateUnisex = (
	oldVal: GenderEnum,
	newVal: GenderFormEnum,
): boolean => {
	switch (oldVal) {
		case GenderEnum.Women:
			return newVal === GenderEnum.Men;

		case GenderEnum.Men:
			return newVal === GenderEnum.Women;

		case GenderEnum.Unisex:
			return false;

		default:
			throw new Error(`Unexpected gender: ${oldVal}`);
	}
};

export const toProductWithoutId = (
	product: ProductDiscount,
): ProductWithoutId => {
	return {
		productCode: product.productCode,
		name: product.name,
		gender: product.gender,
		officialUrl: product.officialUrl,
		imageUrl: product.imageUrl,
	};
};
