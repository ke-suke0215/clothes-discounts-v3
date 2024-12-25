import { InsertProductDiscountsForm } from '~/backend/application/dto/insert-product-discount-form';

export default class InsertProductDiscountService {
  private _db: PrismaClient;

  // TODO: できればDBClientは引数で受け取らないようにしたい
  constructor(dbClient: PrismaClient) {
    this._db = dbClient;
  }

  // 商品と割引履歴を登録する
  async execute(form: InsertProductDiscountsForm): Promise<void> {
    return
  }

  private async insertProduct(form: InsertProductDiscountsForm): Promise<void> {
    return
  }

  private async insertDiscountHistory(productId: number, price: number, date: Date): Promise<void> {
    return
  }
}