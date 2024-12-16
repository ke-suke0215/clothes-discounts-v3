import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';

export interface Env {
	DB: D1Database;
}

export const connection = async (db: D1Database) => {
	const adapter = new PrismaD1(db); // Cloudflare D1 用のアダプター
	return new PrismaClient({ adapter }); // PrismaClient にアダプターを渡す
};
