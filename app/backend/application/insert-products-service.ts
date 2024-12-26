import {
	ProductDiscount,
	shouldUpdateUnisex,
	toProductWithoutId,
} from '~/backend/application/dto/insert-product-discount-form';
import { PrismaClient } from '@prisma/client';
import { ProductRepository } from '~/backend/infrastructure/product-repository';
import { Product, ProductWithoutId } from '../domain/models/product';
import { GenderEnum } from '../domain/models/gender';

export default class InsertProductsService {
	private _db: PrismaClient;

	// TODO: できればDBClientは引数で受け取らないようにしたい
	constructor(dbClient: PrismaClient) {
		this._db = dbClient;
	}

	// 商品を登録or更新する
	async execute(products: ProductDiscount[]): Promise<void> {
		const productRepository = new ProductRepository(this._db); // TODO: DI使いたい

		// DBに存在する商品を取得
		const productCodes = products.map(product => product.productCode);
		const existingProducts: Product[] =
			await productRepository.findByProductCodes(productCodes);

		// 渡された商品のうち、DBに存在しない商品のみを登録する
		const productsToCreate: ProductWithoutId[] = products
			.filter(
				product =>
					!existingProducts.some(
						existingProduct =>
							existingProduct.productCode === product.productCode,
					),
			)
			.map(product => toProductWithoutId(product));

		productRepository.createByList(productsToCreate);

		// すでに存在する商品のうち、性別が異なる値であればUnisexに変更する
		const productsToUpdate: Product[] = existingProducts.filter(
			existingProduct => {
				const duplicateProduct: ProductDiscount | undefined = products.find(
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
	}
}
