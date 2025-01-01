import {
	PrismaClient,
	type DiscountHistory as PrismaDiscountHistory,
} from '@prisma/client';
import {
	DiscountHistory,
	DiscountHistoryWithoutId,
} from '../domain/models/discount-history';

export class DiscountHistoryRepository {
	private _db: PrismaClient;

	constructor(dbClient: PrismaClient) {
		this._db = dbClient;
	}

	async findByProductId(productId: number): Promise<DiscountHistory[]> {
		const discountHistories = await this._db.discountHistory.findMany({
			where: {
				productId: productId,
			},
			orderBy: {
				id: 'asc',
			},
		});

		return discountHistories.map(dh => this.build(dh));
	}

	async findProductIdsByDate(date: Date): Promise<number[]> {
		const yyyymmdd = this.dateToNumber(date);
		const discountHistories = await this._db.discountHistory.findMany({
			where: {
				date: yyyymmdd,
			},
			orderBy: {
				productId: 'asc',
			},
		});

		return discountHistories.map(dh => dh.productId);
	}

	// 一括登録
	// 登録した要素を返す
	async createByList(
		discountHistories: DiscountHistoryWithoutId[],
	): Promise<DiscountHistory[]> {
		const prismaDiscountHistories: PrismaDiscountHistory[] =
			await this._db.discountHistory.createManyAndReturn({
				data: discountHistories.map(dh => ({
					productId: dh.productId,
					date: this.dateToNumber(dh.date),
					price: dh.price,
				})),
			});

		return prismaDiscountHistories.map(this.build.bind(this));
	}

	// Date型をyyyyMMddの数値に変換する
	private dateToNumber(date: Date): number {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return parseInt(`${year}${month}${day}`);
	}

	// yyyyyMMddの数値をDate型に変換する
	private numberToDate(yyyymmdd: number): Date {
		const yyyymmddStr = String(yyyymmdd);
		const year = parseInt(yyyymmddStr.slice(0, 4));
		const month = parseInt(yyyymmddStr.slice(4, 6)) - 1;
		const day = parseInt(yyyymmddStr.slice(6, 8));

		// JST（指定なし）だと時差によって-9時間されてしまうのでUTCで日付を生成
		return new Date(Date.UTC(year, month, day));
	}

	private build(history: PrismaDiscountHistory): DiscountHistory {
		return {
			id: history.id,
			productId: history.productId,
			date: this.numberToDate(history.date),
			price: history.price,
		};
	}
}
