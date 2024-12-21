import { Product } from '../domain/models/product';
import { PrismaClient } from '@prisma/client';

export class ProductRepository {
	private _db: PrismaClient;

	constructor(dbClient: PrismaClient) {
		this._db = dbClient;
	}

	async findByIds(ids: number[]): Promise<Product[]> {
		const products = await this._db.product.findMany({
			where: {
				id: {
					in: ids,
				},
			},
		});
		return products.map(product => this.toEntity(product));
	}

	private toEntity(product: any): Product {
		return new Product({
			id: product.id,
			productCode: product.productCode,
			name: product.name,
			gender: product.gender,
			officialUrl: product.officialUrl,
			imageUrl: product.imageUrl,
		});
	}

	// 文字列の配列を指定して、nameで複合曖昧検索
	// findByName(names: string[]): Product[] {
	// 	const lowerCaseNames = names.map(name => name.toLowerCase());
	// 	return this.products.filter(product =>
	// 		lowerCaseNames.some(name => product.name.toLowerCase().includes(name)),
	// 	);
	// }
}
