import Gender from './gender';

export default class Product {
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
}
