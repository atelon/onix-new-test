const cheerio = require("cheerio");
const ParserInternalError = require("./errors/ParserInternalError");

class Parser {
	setParser(callback) {
		this.callback = callback;
		return this;
	}

	parseContent(data) {
		let $;

		try {
			$ = cheerio.load(data);
		} catch (err) {
			throw new ParserInternalError(err);
		}

		return this.callback($);
	}
}

module.exports = Parser;
