export enum GenderEnum {
	Unisex = 0,
	Women = 1,
	Men = 2,
}

const forWomenSet = new Set([GenderEnum.Unisex, GenderEnum.Women]);
const forMenSet = new Set([GenderEnum.Unisex, GenderEnum.Men]);

export const isForWomen = (genderEnum: GenderEnum): boolean => {
	return forWomenSet.has(genderEnum);
};

export const isForMen = (genderEnum: GenderEnum): boolean => {
	return forMenSet.has(genderEnum);
};
