class ILimiterError extends Error {
	constructor(message) {
		super();
		this.message = message;
		this.name = "E_QUEUE";
	}
}

module.exports = ILimiterError;
