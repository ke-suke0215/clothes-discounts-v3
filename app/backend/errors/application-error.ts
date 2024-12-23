export class ApplicationError extends Error {
	status: number;

	constructor(message: string, name: string, status: number) {
		super(message);
		this.name = name;
		this.status = status;
	}
}
