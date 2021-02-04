// Doubly Linked List
// https://en.wikipedia.org/wiki/Doubly_linked_list

const DLN = require("./DLN");

class DLL {
	constructor() {
		this.head = null;
		this.tail = null;
		this.iLength = 0;
	}

	insertAfter(DLNObject, newDLNObject) {
		newDLNObject.setPrevious(DLNObject);

		if (!DLNObject.getNext()) {
			newDLNObject.setNext(null);
			this.tail = newDLNObject;
		} else {
			newDLNObject.setNext(DLNObject.getNext());
			DLNObject.getNext().setPrevious(newDLNObject);
		}

		DLNObject.setNext(newDLNObject);

		this.iLength += 1;
	}

	insertBefore(DLNObject, newDLNObject) {
		newDLNObject.setNext(DLNObject);

		if (!DLNObject.getPrevious()) {
			newDLNObject.setPrevious(null);
			this.head = newDLNObject;
		} else {
			newDLNObject.setPrevious(DLNObject.getPrevious());
			DLNObject.getPrevious().setNext(newDLNObject);
		}

		DLNObject.setPrevious(newDLNObject);

		this.iLength += 1;
	}

	insertBeginning(newDLNObject) {
		if (!this.head) {
			this.head = newDLNObject;
			this.tail = newDLNObject;
			newDLNObject.setPrevious(null);
			newDLNObject.setNext(null);
			this.iLength += 1;
		} else this.insertBefore(this.head, newDLNObject);
	}

	insertEnd(newDLNObject) {
		if (!this.tail) this.insertBeginning(newDLNObject);
		else this.insertAfter(this.tail, newDLNObject);
	}

	remove(DLNObject) {
		if (!DLNObject.getPrevious()) this.head = DLNObject.getNext();
		else DLNObject.getPrevious().setNext(DLNObject.getNext());

		if (!DLNObject.getNext()) this.tail = DLNObject.getPrevious();
		else DLNObject.getNext().setPrevious(DLNObject.getPrevious());

		this.iLength -= 1;
	}

	// Array syntax sugar
	push(DLNObject) {
		this.insertEnd(DLNObject);
	}

	pop() {
		if (!this.tail) return null;

		const copyDLNObject = new DLN(this.tail.getData());
		this.remove(this.tail);

		return copyDLNObject;
	}

	unshift(DLNObject) {
		this.insertBeginning(DLNObject);
		return this.iLength;
	}

	shift() {
		if (!this.tail) return null;

		const copyDLNObject = new DLN(this.head.getData());
		this.remove(this.head);
		return copyDLNObject;
	}

	isEmpty() {
		return !!this.tail;
	}

	// Traversing the list, forward direction case
	*[Symbol.iterator]() {
		let current = this.head;
		while (current) {
			yield current.getData();
			current = current.getNext();
		}
	}

	get length() {
		return this.iLength;
	}

	set length(length) {
		this.iLength = length;
	}
}

module.exports = DLL;
