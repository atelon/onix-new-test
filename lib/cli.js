const meow = require("meow");

const cli = meow(
	`
	Usage
	  $ loader <url>

	Options
	  --limit, -l  Limit parallel download

    Examples
      $ loader 'https://interns-blog.herokuapp.com/v1/topic'
      $ loader 'https://interns-blog.herokuapp.com/v1/topic' --limit 3
      $ loader  --limit 3 'https://interns-blog.herokuapp.com/v1/topic'
`,
	{
		flags: {
			limit: {
				type: "number",
				alias: "l",
			},
		},
	}
);

module.exports = cli;
