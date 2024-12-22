import {
	PrismaClient,
	// type DiscountHistory as PrismaDiscountHistory,
} from '@prisma/client';
// import { DiscountHistory } from '../domain/models/discount-history';

export class DiscountHistoryRepository {
	private _db: PrismaClient;

	constructor(dbClient: PrismaClient) {
		this._db = dbClient;
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

	// Date型をyyyymmddの数値に変換する
	private dateToNumber(date: Date): number {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return parseInt(`${year}${month}${day}`);
	}

	// 以下は後々必要になるはず

	// // yyyyymmddの数値をDate型に変換する
	// private numberToDate(yyyymmdd: number): Date {
	// 	const yyyymmddStr = String(yyyymmdd);
	// 	const year = parseInt(yyyymmddStr.slice(0, 4));
	// 	const month = parseInt(yyyymmddStr.slice(4, 6)) - 1;
	// 	const day = parseInt(yyyymmddStr.slice(6, 8));
	// 	return new Date(year, month, day);
	// }

	// private build(history: PrismaDiscountHistory): DiscountHistory {
	// 	return {
	// 		id: history.id,
	// 		productId: history.productId,
	// 		date: this.numberToDate(history.date),
	// 		price: history.price,
	// 	};
	// }
}
