export enum GenderEnum {
	Unisex = 0,
	Women = 1,
	Men = 2,
}

const forWomenNumSet = new Set([GenderEnum.Unisex, GenderEnum.Women]);
const forMenNumSet = new Set([GenderEnum.Unisex, GenderEnum.Men]);

export class Gender {
	constructor(private readonly value: GenderEnum) {
		if (!Object.values(GenderEnum).includes(value)) {
			throw new Error(`Invalid value for GenderEnum: ${value}`);
		}
	}

	isForMen(): boolean {
		return forMenNumSet.has(this.value);
	}

	isForWomen(): boolean {
		return forWomenNumSet.has(this.value);
	}

	toPlain(): GenderEnum {
		return this.value;
	}
}

export const isForWomen = (genderEnum: GenderEnum): boolean => {
	return forWomenNumSet.has(genderEnum);
};

export const isForMen = (genderEnum: GenderEnum): boolean => {
	return forMenNumSet.has(genderEnum);
};
