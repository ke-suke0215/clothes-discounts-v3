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

		// 商品の性別を更新するプロダクトのIDを取得
		// すでに存在する商品のうち、性別が異なる値であればUnisexに変更する
		const productsToUpdateGenderIds: number[] = existingProducts
			.filter(existingProduct => {
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
			})
			.map(product => product.id);

		// 商品の画像と名前を更新するプロダクトのIDを取得
		const productsToUpdateOtherIds: number[] = existingProducts
			.filter(existingProduct => {
				const duplicateProduct: ProductDiscount | undefined =
					deliveredProductDiscounts.find(
						product => existingProduct.productCode === product.productCode,
					);

				if (!duplicateProduct) {
					return false;
				}

				return (
					existingProduct.imageUrl !== duplicateProduct.imageUrl ||
					existingProduct.name !== duplicateProduct.name ||
					existingProduct.officialUrl !== duplicateProduct.officialUrl
				);
			})
			.map(product => product.id);

		const productsToUpdateIds = productsToUpdateGenderIds.concat(
			productsToUpdateOtherIds,
		);

		const fixedProducts: Product[] = productsToUpdateIds.map(id => {
			const product = existingProducts.find(product => product.id === id);
			if (!product) throw new Error(`Product not found: ${id}`);

			const duplicateProduct = deliveredProductDiscounts.find(
				deliveredProduct =>
					product.productCode === deliveredProduct.productCode,
			);

			const gender = productsToUpdateGenderIds.includes(id)
				? GenderEnum.Unisex
				: product.gender;
			const imageUrl = duplicateProduct?.imageUrl ?? product.imageUrl;
			const name = duplicateProduct?.name ?? product.name;
			const officialUrl = duplicateProduct?.officialUrl ?? product.officialUrl;

			return {
				...product,
				gender: gender,
				imageUrl: imageUrl,
				name: name,
				officialUrl: officialUrl,
			};
		});

		productRepository.updateByList(fixedProducts);

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
