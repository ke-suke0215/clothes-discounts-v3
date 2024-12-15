export type Product = {
	id: number;
	productCode: number;
	name: string;
	gender: number;
	officialUrl: string;
	imageUrl: string;
	addedOn: string;
};

export const products: Product[] = [
	{
		id: 1,
		productCode: 101,
		name: 'ストレッチセルビッジスリムフィットジーンズ',
		gender: 2,
		officialUrl: 'https://www.uniqlo.com/jp/ja/products/E418910-000/00',
		imageUrl:
			'https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/418910/item/goods_69_418910.jpg?width=3000',
		addedOn: '2023-10-28 00:00:00',
	},
	{
		id: 2,
		productCode: 102,
		name: 'クルーネックTシャツ（半袖）',
		gender: 2,
		officialUrl: 'https://www.uniqlo.com/jp/ja/products/E422992-000/00',
		imageUrl:
			'https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/422992/item/goods_07_422992.jpg?width=300',
		addedOn: '2023-06-30 00:00:00',
	},
	{
		id: 3,
		productCode: 103,
		name: 'エアリズムコットンオーバーサイズTシャツ（5分袖）',
		gender: 1,
		officialUrl: 'https://www.uniqlo.com/jp/ja/products/E425974-000/00',
		imageUrl:
			'https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/425974/item/goods_09_425974.jpg?width=300',
		addedOn: '2023-06-24 00:00:00',
	},
	{
		id: 4,
		productCode: 104,
		name: 'ドライカラーVネックT（半袖）',
		gender: 1,
		officialUrl: 'https://www.uniqlo.com/jp/ja/products/E427916-000/00',
		imageUrl:
			'https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/427916/item/goods_00_427916.jpg?width=300',
		addedOn: '2023-07-17 00:00:00',
	},
	{
		id: 5,
		productCode: 105,
		name: 'ドライカラークルーネックT（半袖）',
		gender: 0,
		officialUrl: 'https://www.uniqlo.com/jp/ja/products/E427917-000/00',
		imageUrl:
			'https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/427917/item/goods_55_427917.jpg?width=300',
		addedOn: '2023-07-17 00:00:00',
	},
	{
		id: 6,
		productCode: 106,
		name: 'ヒートテックショートソックス',
		gender: 0,
		officialUrl: 'https://www.uniqlo.com/jp/ja/products/E431636-000/00',
		imageUrl:
			'https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/431636/item/goods_68_431636.jpg?width=300',
		addedOn: '2024-01-27 00:00:00',
	},
];
