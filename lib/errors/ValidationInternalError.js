class ValidationInternalError extends Error {
	constructor(message) {
		super();
		this.message = message;
		this.name = "E_VALIDATION_INTERNAL";
	}
}

module.exports = ValidationInternalError;
