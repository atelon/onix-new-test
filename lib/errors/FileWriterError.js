class FileWriterError extends Error {
	constructor(message) {
		super();
		this.message = message;
		this.name = "E_FILE_WRITER";
	}
}

module.exports = FileWriterError;
