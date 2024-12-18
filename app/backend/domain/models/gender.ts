enum GenderEnum {
	Unisex = 0,
	Women = 1,
	Men = 2,
}

export default class Gender {
	constructor(private readonly value: GenderEnum) {
		if (!Object.values(GenderEnum).includes(value)) {
			throw new Error(`Invalid value for GenderEnum: ${value}`);
		}
	}

	isForMen(): boolean {
		return this.value === GenderEnum.Men || this.value === GenderEnum.Unisex;
	}

	isForWomen(): boolean {
		return this.value === GenderEnum.Women || this.value === GenderEnum.Unisex;
	}
}
