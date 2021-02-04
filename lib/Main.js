const { htmlEscape } = require("escape-goat");
const cli = require("./cli");
const ValidationInput = require("./ValidationInput");
const ILimiter = require("./ILimiter");
const ContentLoader = require("./ContentLoader");
const Parser = require("./Parser");
const DateProcessor = require("./DateProcessor");
const FileWriter = require("./FileWriter");
const Logger = require("./Logger");

class Main {
	constructor() {
		this.ILimiter = new ILimiter();
		this.ContentLoader = new ContentLoader();
		this.Parser = new Parser();
		this.DateProcessor = new DateProcessor();
		this.FileWriter = new FileWriter();
		this.Logger = Logger;
	}

	async main() {
		this.Logger.info("Starting program...");
		this.Logger.info("Processing input...");

		new ValidationInput(cli.input).validate();
		let limit = 1;
		if ("limit" in cli.flags) {
			limit = cli.flags.limit;
		}

		this.Logger.info("Finished validation");

		const { data } = await ContentLoader.getContent(cli.input[0]);

		this.Logger.info("Mining links...");

		const links = this.Parser.setParser(($) => {
			const newLinks = [];
			$($(".content .container-center .topics").children()[5])
				.children()
				.each((index, element) => {
					// last (first in dom perspective) 10 topics
					if (index <= 9) {
						newLinks.push($(element).find("h2 a:first").attr("href"));
					}
				});
			return newLinks;
		}).parseContent(data);

		this.Logger.info("Mining links completed");

		// extract base
		// not reliable!
		const baseUrl = new RegExp("//(.*?)/").exec(cli.input[0]);
		const protocol = new RegExp("^.*?//").exec(cli.input[0]);

		const updatedLink = links.map((el) => protocol[0] + baseUrl[1] + el);

		this.Logger.info(`Links: ${updatedLink}`);

		this.Logger.info("Starting to receive the data...");

		// overall dangerous - missing filtration action on parsing text
		// it may dmg file structure
		//! known bug
		const processedLink = await this.ILimiter.setConcurrency(limit)
			.addTask(updatedLink, async (el) => {
				this.Logger.info(`Starting to load content from ${el}`);
				const resultContent = await ContentLoader.getContent(el);
				this.Logger.info(`Load content from ${el} completed`);
				this.Logger.info(`Starting parsing content from ${el}`);
				const receivedData = this.Parser.setParser(($) => {
					const msgs = {
						origin: el,
						title: htmlEscape($(".post-title").text().trim()),
						author: htmlEscape($(".post-author").text().trim()),
						description: htmlEscape($(".post-description > p").text().trim()),
						messages: [],
					};

					$(".messages > .message")
						.children()
						.each((index, element) => {
							msgs.messages.push({
								author: htmlEscape(
									$(element).find(".message-author").text().trim()
								),
								date: DateProcessor.processDate(
									htmlEscape(
										$(element).find(".message-meta > span").text().trim()
									)
								),
								text: htmlEscape(
									$(element).find(".message-description > p").text().trim()
								),
							});
						});

					return msgs;
				}).parseContent(resultContent.data);

				this.Logger.info(`Parsing from ${el} completed.`);

				this.Logger.info(`Writing content from ${el} to file`);

				const filename = new RegExp("/v1/topic/(.*?)/message").exec(el)[1];
				await this.FileWriter.setPath("./../files")
					.setFileName(filename)
					.setData(receivedData)
					.write();
				this.Logger.info(
					`Writing content from ${el} completed. File saved as ${filename}.`
				);
				return el;
			})
			.getResults();

		this.Logger.info("Finished operations on the data");

		this.Logger.info("Starting to search for rejected loads");

		// Check if all loads are resolved
		// eslint-disable-next-line no-plusplus
		for (let i = 0; i < processedLink.length; i++) {
			// eslint-disable-next-line security/detect-object-injection
			if (processedLink[i].status === "rejected") {
				// eslint-disable-next-line security/detect-object-injection
				this.Logger.error(`Rejected: ${processedLink[i].value}`);
			}
		}

		this.Logger.info("Searching for rejected loads completed");

		this.Logger.info("Program finished execution");
	}
}

module.exports = new Main();
