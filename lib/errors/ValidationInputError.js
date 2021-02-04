class ValidationInputError extends Error {
	constructor(message) {
		super();
		this.message = message;
		this.name = "E_MISSING_OR_INVALID_URL";
	}
}

module.exports = ValidationInputError;
