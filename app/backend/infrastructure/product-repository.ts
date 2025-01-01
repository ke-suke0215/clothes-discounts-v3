import { Product, ProductWithoutId } from '../domain/models/product';
import { PrismaClient, type Product as PrismaProduct } from '@prisma/client';

export class ProductRepository {
	private _db: PrismaClient;

	constructor(dbClient: PrismaClient) {
		this._db = dbClient;
	}

	async findById(id: number): Promise<Product | null> {
		const product = await this._db.product.findUnique({
			where: {
				id: id,
			},
		});
		return product ? this.build(product) : null;
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

	async findByProductCodes(productCode: string[]): Promise<Product[]> {
		if (productCode.length === 0 || productCode.every(code => code === '')) {
			return [];
		}

		const products = await this._db.product.findMany({
			where: {
				OR: productCode.map(code => ({
					productCode: {
						equals: code,
					},
				})),
			},
			orderBy: {
				id: 'asc',
			},
		});

		return products.map(this.build);
	}

	async createByList(products: ProductWithoutId[]): Promise<Product[]> {
		const prismaProducts: PrismaProduct[] =
			await this._db.product.createManyAndReturn({
				data: products,
			});

		return prismaProducts.map(this.build);
	}

	async updateByList(products: Product[]): Promise<void> {
		await Promise.all(
			products.map(product =>
				this._db.product.update({
					where: {
						id: product.id,
					},
					data: {
						productCode: product.productCode,
						name: product.name,
						gender: product.gender,
						officialUrl: product.officialUrl,
						imageUrl: product.imageUrl,
					},
				}),
			),
		);
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
