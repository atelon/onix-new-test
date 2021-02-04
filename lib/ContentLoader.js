const axios = require("axios");

class ContentLoader {
	static getContent(url) {
		return axios({
			method: "get",
			url,
			responseType: "text",
		});
	}
}

module.exports = ContentLoader;
