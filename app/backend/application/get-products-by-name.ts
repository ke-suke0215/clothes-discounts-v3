import { Product } from '../domain/models/product';
import { ProductRepository } from '../infrastructure/product-repository';
import { PrismaClient } from '@prisma/client';

export default class GetProductsByNameService {
	// TODO: できればDBClientは引数で受け取らないようにしたい
	private _db: PrismaClient;

	constructor(dbClient: PrismaClient) {
		this._db = dbClient;
	}

	// 名前で商品を曖昧検索する
	async execute(name: string): Promise<Product[]> {
		const keyWords = name.split(/[ ,]+/);

		// Repository呼び出し
		return await new ProductRepository(this._db).findByName(keyWords);
	}
}
