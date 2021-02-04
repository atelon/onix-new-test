const fs = require("fs");
const path = require("path");
const util = require("util");

// eslint-disable-next-line security/detect-non-literal-fs-filename
const writeFileAsync = util.promisify(fs.writeFile);
const FileWriterError = require("./errors/FileWriterError");

class FileWriter {
	constructor() {
		this.fileContent = "";
		this.path = "";
		this.fileName = "";
		this.fileExt = "json";
		this.encoding = "utf8";
	}

	setData(obj) {
		let json;

		try {
			json = JSON.stringify(obj, null, 2);
		} catch (err) {
			throw new FileWriterError(`Can't convert obj to string`);
		}

		this.fileContent = json;

		return this;
	}

	setPath(str) {
		this.path = str;
		return this;
	}

	setFileName(str) {
		this.fileName = str;
		return this;
	}

	setExt(str) {
		this.fileExt = str;
		return this;
	}

	setEncoding(str) {
		this.encoding = str;
		return this;
	}

	write() {
		const fileName = path.resolve(
			__dirname,
			this.path,
			`${this.fileName}.${this.fileExt}`
		);
		// eslint-disable-next-line security/detect-non-literal-fs-filename
		return writeFileAsync(fileName, this.fileContent, this.encoding);
	}
}

module.exports = FileWriter;
