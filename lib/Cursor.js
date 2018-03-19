const OriginalCursor = require('nedb/lib/cursor');

class Cursor {
	constructor(original, prerequisite) {
		if (!(original instanceof OriginalCursor))
			throw new TypeError(`Unexpected ${typeof original}, expected: Cursor (nedb/lib/cursor)`);

		if (!(prerequisite instanceof Promise))
			prerequisite = Promise.resolve();

		Object.defineProperties(this, {
			__original: {
				configurable: false,
				enumerable: false,
				writable: false,
				value: original
			},

			__prerequisite: {
				configurable: false,
				enumerable: false,
				writable: false,
				value: prerequisite
			}
		});
	}

	sort() {
		this.__original.sort.apply(this.__original, arguments);
		return this;
	}

	skip() {
		this.__original.skip.apply(this.__original, arguments);
		return this;
	}

	limit() {
		this.__original.limit.apply(this.__original, arguments);
		return this;
	}

	exec() {
		return this.__prerequisite.then(() => {
			return new Promise((resolve, reject) => {
				this.__original.exec((error, result) => {
					if (error)
						reject(error);
					resolve(result);
				});
			});
		});
	}

	then(onFulfilled, onRejected) {
		return this.exec().then(onFulfilled, onRejected);
	}
}

module.exports = Cursor;