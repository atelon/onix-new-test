const Joi = require("joi");
const ValidationInputError = require("./errors/ValidationInputError");
const ValidationInternalError = require("./errors/ValidationInternalError");

class ValidationInput {
	static validateArray(arr) {
		const { error } = Joi.array().min(1).required().validate(arr);
		if (error) {
			throw new ValidationInputError("Missing or invalid url parameter(-s)");
		}
	}

	static validProtocol(str) {
		try {
			return new RegExp("^https?:\\/\\/", "g").test(str);
		} catch (_) {
			throw new ValidationInternalError("Not valid protocol");
		}
	}

	constructor(arr) {
		ValidationInput.validateArray(arr);
		this.validationArray = arr;
	}

	validate() {
		const dataArr = this.validationArray;

		// eslint-disable-next-line no-plusplus
		for (let i = 0; i < dataArr.length; i++) {
			// eslint-disable-next-line security/detect-object-injection
			const { error } = Joi.string().uri().required().validate(dataArr[i]);

			if (error) {
				// eslint-disable-next-line security/detect-object-injection
				throw new ValidationInputError(
					`Not valid url '${dataArr[i]}' parameter at pos [${i}]`
				);
			}

			// eslint-disable-next-line security/detect-object-injection
			if (!ValidationInput.validProtocol(dataArr[i])) {
				// eslint-disable-next-line security/detect-object-injection
				throw new ValidationInputError(
					`Not valid url '${dataArr[i]}' parameter at pos [${i}]`
				);
			}
		}
	}
}

module.exports = ValidationInput;
