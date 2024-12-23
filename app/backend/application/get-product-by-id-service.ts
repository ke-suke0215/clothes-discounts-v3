import type { Product } from '../domain/models/product';
import {
	type ProductWithDiscountHistoriesViewModel,
	buildProductWithDiscountHistories,
} from './dto/product-with-discount-histories-view-model';
import { ProductRepository } from '../infrastructure/product-repository';
import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../errors/not-found-error';
import { DiscountHistory } from '../domain/models/discount-history';
import { DiscountHistoryRepository } from '../infrastructure/discount-history-repository';

export default class GetProductByIdService {
	// TODO: できればDBClientは引数で受け取らないようにしたい
	private _db: PrismaClient;

	constructor(dbClient: PrismaClient) {
		this._db = dbClient;
	}

	// IDを指定して商品を取得する
	async execute(
		productId: number,
	): Promise<ProductWithDiscountHistoriesViewModel> {
		// TODO: 将来的にDIを導入してRepositoryはそこから取得するようにする
		const product: Product | null = await new ProductRepository(
			this._db,
		).findById(productId);
		if (!product) {
			throw new NotFoundError('Product not found. ID: ' + productId);
		}

		const discountHistories: DiscountHistory[] =
			await new DiscountHistoryRepository(this._db).findByProductId(productId);

		return buildProductWithDiscountHistories(product, discountHistories);
	}
}
