import { Product } from '../domain/models/product';
import { ProductRepository } from '../infrastructure/product-repository';
import { PrismaClient } from '@prisma/client';

export default class GetProductsByDiscountDateService {
	// TODO: できればDBClientは引数で受け取らないようにしたい
	private _db: PrismaClient;

	constructor(dbClient: PrismaClient) {
		this._db = dbClient;
	}

	async execute(discountDate: Date): Promise<Product[]> {
		const productIds = [1, 10, 20, 30]; // とりあえず固定で取得
		// TODO: 将来的にDIを導入してRepositoryはそこから取得するようにする
		const products: Product[] = await new ProductRepository(this._db).findByIds(
			productIds,
		);
		return products;
	}
}
