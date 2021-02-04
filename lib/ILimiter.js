const Joi = require("joi");
const DLL = require("./DLL");
const DLN = require("./DLN");
const ILimiterError = require("./errors/ILimiterError");

class ILimiter {
	constructor() {
		this.tasks = new DLL();
		this.numberOfAwaitingTasks = 0;
		this.maxConcurrency = 1;
	}

	setConcurrency(concurrency) {
		this.maxConcurrency = concurrency;
		return this;
	}

	setDefaultCallback(callback) {
		this.operation = callback;
		return this;
	}

	addTask(data, callback = null) {
		function addCallbackToData(fData, fCallback) {
			let newData;
			if (callback === null) {
				newData = new DLN({ data: fData, callback: this.operation });
			} else if (callback instanceof Function) {
				newData = new DLN({ data: fData, callback: fCallback });
			} else
				throw new ILimiterError(
					`Parameter 'callback' should be a 'Function' or omitted`
				);
			return newData;
		}

		let validation = Joi.array().items(Joi.string()).required().validate(data);
		if (validation.error) {
			validation = Joi.string().required().validate(data);
			if (validation.error) {
				throw new ILimiterError(
					`Parameter 'data' should be a 'string' or 'array of strings'`
				);
			}
			// else
			const newData = addCallbackToData(data, callback);
			this.tasks.push(newData);
		} else {
			// eslint-disable-next-line no-restricted-syntax
			for (const el of data) {
				const newData = addCallbackToData(el, callback);
				this.tasks.push(newData);
			}
		}
		return this;
	}

	async getResults() {
		// yea, better to just limit via promise
		// otherwise just need create native module
		// reference: https://github.com/rxaviers/async-pool
		const returnTasks = [];
		const executingTasks = [];
		// eslint-disable-next-line no-restricted-syntax
		for (const task of this.tasks) {
			const currentTask = Promise.resolve().then(() =>
				task.callback(task.data)
			);
			returnTasks.push(currentTask);

			if (this.maxConcurrency <= this.tasks.length) {
				const executeTask = currentTask.then(() =>
					executingTasks.splice(executingTasks.indexOf(executeTask), 1)
				);
				executingTasks.push(executeTask);
				if (executingTasks.length >= this.maxConcurrency) {
					// eslint-disable-next-line no-await-in-loop
					await Promise.race(executingTasks);
				}
			}
		}
		return Promise.allSettled(returnTasks);
	}
}

module.exports = ILimiter;
