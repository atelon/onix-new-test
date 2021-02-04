class ParserInternalError extends Error {
	constructor(message) {
		super();
		this.message = message;
		this.name = "E_PARSER_INTERNAL";
	}
}

module.exports = ParserInternalError;
