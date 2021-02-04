module.exports = {
	extends: [
		"eslint:recommended",
		"plugin:node/recommended",
		"airbnb-base",
		"plugin:import/errors",
		"plugin:import/warnings",
		"plugin:security/recommended",
		"plugin:sonarjs/recommended",
		"prettier",
	],
	env: {
		es2021: true,
		node: true,
	},
	plugins: ["node", "sonarjs", "security"],
	parserOptions: {
		ecmaVersion: 2021,
	},
	rules: {
		indent: ["error", 2],
		"no-console": 0,
		"consistent-return": 0,
		"arrow-parens": 0,
		"comma-dangle": 0,
		"no-param-reassign": 0,
	},
};
