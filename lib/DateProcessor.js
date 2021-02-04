const moment = require("moment");

class DateProcessor {
	static processDate(data) {
		const date = data.split();

		return moment()
			.subtract(date[0], date[1])
			.format("dddd, MMMM Do YYYY, h:mm:ss a");
	}
}

module.exports = DateProcessor;
