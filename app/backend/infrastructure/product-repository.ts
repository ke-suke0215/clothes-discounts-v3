import { Product } from '../domain/models/product';
import { PrismaClient, type Product as PrismaProduct } from '@prisma/client';

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
			orderBy: {
				id: 'asc',
			},
		});
		return products.map(this.build);
	}

	// 文字列の配列を指定して、nameで複合曖昧検索
	async findByName(keyWords: string[]): Promise<Product[]> {
		if (keyWords.length === 0 || keyWords.every(keyword => keyword === '')) {
			return [];
		}

		const products = await this._db.product.findMany({
			where: {
				AND: keyWords.map(keyword => ({
					name: {
						contains: keyword,
					},
				})),
			},
			orderBy: {
				id: 'asc',
			},
		});

		return products.map(this.build);
	}

	private build(product: PrismaProduct): Product {
		return {
			id: product.id,
			productCode: product.productCode,
			name: product.name,
			gender: product.gender,
			officialUrl: product.officialUrl,
			imageUrl: product.imageUrl,
		};
	}
}
