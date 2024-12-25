export type InsertProductDiscountsForm = {
  productDiscounts: ProductDiscount[];
}

export type ProductDiscount = {
  productCode: string;
  name: string;
  gender: GendeFormEnum;
  officialUrl: string;
  imageUrl: string;
  price: number;
  date: string; // yyyy-MM-dd
};

enum GendeFormEnum {
	Women = 1,
	Men = 2,
}
