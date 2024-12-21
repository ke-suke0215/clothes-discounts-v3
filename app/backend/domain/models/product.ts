import { Gender } from './gender';
import { ProductType } from '~/types/product';

export class Product {
	readonly id: number;
	readonly productCode: string;
	readonly name: string;
	private readonly _gender: Gender;
	readonly officialUrl: string;
	readonly imageUrl: string;

	constructor({
		id,
		productCode,
		name,
		gender,
		officialUrl,
		imageUrl,
	}: {
		id: number;
		productCode: string;
		name: string;
		gender: number;
		officialUrl: string;
		imageUrl: string;
	}) {
		this.id = id;
		this.productCode = productCode;
		this.name = name;
		this._gender = new Gender(gender);
		this.officialUrl = officialUrl;
		this.imageUrl = imageUrl;
	}

	toPlain(): ProductType {
		return {
			id: this.id,
			productCode: this.productCode,
			name: this.name,
			gender: this._gender.toPlain(),
			officialUrl: this.officialUrl,
			imageUrl: this.imageUrl,
		};
	}
}
