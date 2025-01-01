import {
	InsertProductDiscountsForm,
	ProductDiscount,
	shouldUpdateUnisex,
	toProductWithoutId,
} from '~/backend/application/dto/insert-product-discount-form';
import { PrismaClient } from '@prisma/client';
// import InsertProductsService from './insert-products-service';
import { ProductRepository } from '../infrastructure/product-repository';
import { Product, ProductWithoutId } from '../domain/models/product';
import { GenderEnum } from '../domain/models/gender';
import { DiscountHistoryWithoutId } from '../domain/models/discount-history';
import { DiscountHistoryRepository } from '../infrastructure/discount-history-repository';

export default class InsertProductDiscountService {
	private _db: PrismaClient;

	// TODO: できればDBClientは引数で受け取らないようにしたい
	constructor(dbClient: PrismaClient) {
		this._db = dbClient;
	}

	// 商品と割引履歴を登録する
	async execute(form: InsertProductDiscountsForm): Promise<void> {
		// 渡された割引の日付がすべて同じであることをチェックする
		const dates: string[] = form.productDiscounts.map(product => product.date);
		if (dates.length === 0) {
			return;
		}
		const firstDate = dates[0];
		if (!dates.every(date => date === firstDate)) {
			throw new Error('All dates must be the same');
		}

		const productRepository = new ProductRepository(this._db); // TODO: DI使いたい

		const deliveredProductDiscounts: ProductDiscount[] = form.productDiscounts;

		const deliveredProductCodes = deliveredProductDiscounts.map(
			product => product.productCode,
		);

		// DBに存在する商品を取得
		const existingProducts: Product[] =
			await productRepository.findByProductCodes(deliveredProductCodes);

		// 渡された商品のうち、DBに存在しない商品のみを登録する
		const productsToCreate: ProductWithoutId[] = deliveredProductDiscounts
			.filter(
				product =>
					!existingProducts.some(
						existingProduct =>
							existingProduct.productCode === product.productCode,
					),
			)
			.map(product => toProductWithoutId(product));

		const createdProducts: Product[] =
			await productRepository.createByList(productsToCreate);

		// 商品登録処理完了

		// 商品の性別更新
		// すでに存在する商品のうち、性別が異なる値であればUnisexに変更する
		const productsToUpdate: Product[] = existingProducts.filter(
			existingProduct => {
				const duplicateProduct: ProductDiscount | undefined =
					deliveredProductDiscounts.find(
						product => existingProduct.productCode === product.productCode,
					);

				if (!duplicateProduct) {
					return false;
				}

				return shouldUpdateUnisex(
					existingProduct.gender,
					duplicateProduct.gender,
				);
			},
		);
		const fixedGenderProducts: Product[] = productsToUpdate.map(product => {
			return {
				...product,
				gender: GenderEnum.Unisex,
			};
		});
		productRepository.updateByList(fixedGenderProducts);

		const productsWithId: Product[] = existingProducts.concat(createdProducts);

		// 割引の登録
		const discountHistoryRepository = new DiscountHistoryRepository(this._db);
		const targetDate: Date = new Date(deliveredProductDiscounts[0].date);

		const existingDiscountProductIds: number[] =
			await discountHistoryRepository.findProductIdsByDate(targetDate);

		const discountHistoriesWithoutId: DiscountHistoryWithoutId[] =
			deliveredProductDiscounts
				.map(productDiscount => {
					const productId = productsWithId.find(
						product => product.productCode === productDiscount.productCode,
					)?.id;
					if (!productId) {
						throw new Error(
							`Product not found: ${productDiscount.productCode}`,
						);
					}

					return {
						productId,
						price: productDiscount.price,
						date: new Date(productDiscount.date),
					};
				})
				// insertする割引を重複していないもののみに絞る
				// unisex商品の場合に重複してしまうため
				.filter(productDiscount => {
					return !existingDiscountProductIds.includes(
						productDiscount.productId,
					);
				});

		await discountHistoryRepository.createByList(discountHistoriesWithoutId);

		return;
	}
}
