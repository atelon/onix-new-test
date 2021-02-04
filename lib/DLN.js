// Doubly Linked Node
class DLN {
	constructor(data) {
		if (typeof data === "object" && data !== null) {
			this.data = { ...data };
		} else {
			this.data = data;
		}

		this.next = null;
		this.previous = null;
	}

	setNext(DLNObject) {
		this.next = DLNObject;
	}

	getNext() {
		return this.next;
	}

	setPrevious(DLNObject) {
		this.previous = DLNObject;
	}

	getPrevious() {
		return this.previous;
	}

	getData() {
		return this.data;
	}
}

module.exports = DLN;
