const winston = require("winston");
const process = require("process");
const path = require("path");

class Logger {
	constructor() {
		this.logger = winston.createLogger({
			level: "info",
			transports: [
				new winston.transports.File({
					filename: path.resolve(__dirname, "../logs/info.log"),
				}),
				new winston.transports.File({
					filename: path.resolve(__dirname, "../logs/error.log"),
					level: "error",
				}),
			],
		});

		if (process.env.NODE_ENV !== "production") {
			this.logger.add(
				new winston.transports.Console({
					format: winston.format.simple(),
				})
			);
		}
	}

	error(msg) {
		this.logger.error(msg);
	}

	warn(msg) {
		this.logger.warn(msg);
	}

	info(msg) {
		this.logger.info(msg);
	}

	http(msg) {
		this.logger.http(msg);
	}

	verbose(msg) {
		this.logger.verbose(msg);
	}

	debug(msg) {
		this.logger.debug(msg);
	}

	silly(msg) {
		this.logger.silly(msg);
	}
}

module.exports = new Logger();
