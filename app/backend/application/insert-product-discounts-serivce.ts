import { InsertProductDiscountsForm } from '~/backend/application/dto/insert-product-discount-form';
import { PrismaClient } from '@prisma/client';
import InsertProductsService from './insert-products-service';
import { ProductRepository } from '../infrastructure/product-repository';
import { Product } from '../domain/models/product';

export default class InsertProductDiscountService {
	private _db: PrismaClient;

	// TODO: できればDBClientは引数で受け取らないようにしたい
	constructor(dbClient: PrismaClient) {
		this._db = dbClient;
	}

	// 商品と割引履歴を登録する
	async execute(form: InsertProductDiscountsForm): Promise<void> {
		// create後すぐにreadするとデータが反映されていないことがある。
		// productのIdを取るために再度DBアクセスするのではなく、createの戻り値としてProductの型を返す
		await new InsertProductsService(this._db).execute(form.productDiscounts);

		const productRepository = new ProductRepository(this._db); // TODO: DI使いたい
		const productCodes = form.productDiscounts.map(
			product => product.productCode,
		);

		const products: Product[] =
			await productRepository.findByProductCodes(productCodes);

		console.log(products);

		return;
	}
}
