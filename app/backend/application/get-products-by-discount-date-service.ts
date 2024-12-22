import { Product } from '../domain/models/product';
import { ProductRepository } from '../infrastructure/product-repository';
import { DiscountHistoryRepository } from '../infrastructure/discount-history-repository';
import { PrismaClient } from '@prisma/client';

export default class GetProductsByDiscountDateService {
	// TODO: できればDBClientは引数で受け取らないようにしたい
	private _db: PrismaClient;

	constructor(dbClient: PrismaClient) {
		this._db = dbClient;
	}

	// 指定されたに割引が適用されている商品を取得する
	async execute(discountDate: Date): Promise<Product[]> {
		const productIds = await new DiscountHistoryRepository(
			this._db,
		).findProductIdsByDate(discountDate);

		// TODO: 将来的にDIを導入してRepositoryはそこから取得するようにする
		const products: Product[] = await new ProductRepository(this._db).findByIds(
			productIds,
		);
		return products;
	}
}
