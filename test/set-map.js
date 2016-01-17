const SetMap = require('../dist/set-map');
const assert = require('assert');

describe('SetMap', function () {
	const A = Symbol('A');
	const B = Symbol('B');
	const C = Symbol('C');
	const D = Symbol('D');
	var setMap = null;

	beforeEach(function () {
		setMap = new SetMap();
	});

	it('is a constructor', function () {
		assert.equal(typeof SetMap, 'function');
		assert.ok(new SetMap() instanceof SetMap);
	});

	it('can get and set a single-item path', function () {
		setMap.set([A], 'foobar');
		assert.equal(setMap.get([A]), 'foobar');
	});

	it('can get and set a multi-item path', function () {
		setMap.set([A, B, C], 'foobar');
		assert.equal(setMap.get([A, B, C]), 'foobar');
	});

	describe('#set', function () {
		it('returns the instance for chaining', function () {
			assert.equal(setMap.set([A], 'foobar'), setMap);
		});

		it('takes a zero-length set as input', function () {
			assert.ok(setMap.set([], 'foobar'));
		});

		it('takes a greater-than-zero-length set as input', function () {
			assert.ok(setMap.set([A, B, C, D], 'foobar'));
		});

		it('takes an array or a set as input', function () {
			assert.ok(setMap.set([A], 'Hello'));
			assert.ok(setMap.set(new Set([A]), 'World'));
		});

		it('does not need a value', function () {
			assert.ok(setMap.set([A]));
		});
	});

	describe('#get', function () {
		it('returns undefined for unset values', function () {
			assert.equal(setMap.get([A]), undefined);
			assert.equal(setMap.get([B]), undefined);
			assert.equal(setMap.get([C]), undefined);
			assert.equal(setMap.get([D]), undefined);
			assert.equal(setMap.get([A, B, C]), undefined);
			assert.equal(setMap.get([B, C, D]), undefined);
		});

		it('returns the right value when given the same reference', function () {
			const path = [A];
			setMap.set(path, 'foobar');
			assert.equal(setMap.get(path), 'foobar');
		});

		it('returns the correct value when given a new reference', function () {
			setMap.set([A], 'foobar');
			assert.equal(setMap.get([A]), 'foobar');
		});

		it('returns the correct value when given a set and an array', function () {
			setMap.set(new Set([A]), 'foobar');
			assert.equal(setMap.get([A]), 'foobar');
		});

		it('returns the correct value when given a set with many items', function () {
			setMap.set(new Set([A, B, C, D]), 'foobar');
			assert.equal(setMap.get([A, B, C, D]), 'foobar');
		});

		it('returns the correct value when given a path in any order', function () {
			setMap.set(new Set([A, B, C, D]), 'foobar');
			assert.equal(setMap.get([A, C, B, D]), 'foobar');
			assert.equal(setMap.get([B, C, A, D]), 'foobar');
			assert.equal(setMap.get([D, C, A, B]), 'foobar');
			assert.equal(setMap.get([C, D, A, B]), 'foobar');
			assert.equal(setMap.get([C, A, D, B]), 'foobar');
		});

		it('returns the exact same reference given', function () {
			setMap.set([A, B, C], D);
			assert.equal(setMap.get([A, B, C]), D);
		});

		it('returns undefined when sets do not match', function () {
			setMap.set([A, B, C], 'foobar');
			assert.notEqual(setMap.get([A, B, C, D]), 'foobar');
			assert.notEqual(setMap.get([A, B]), 'foobar');
			assert.notEqual(setMap.get([A, B, D]), 'foobar');
		});
	});

	describe('#has', function () {
		it('returns false when given an undefined path', function () {
			assert.equal(setMap.has([A]), false);
			assert.equal(setMap.has([B]), false);
			assert.equal(setMap.has([C]), false);
			assert.equal(setMap.has([A, B, C]), false);
		});

		it('returns true when given a defined path', function () {
			setMap.set([A, B, C], 'foobar');
			assert.equal(setMap.has([A, B, C]), true);
		});

		it('returns true when sets match', function () {
			setMap.set([A, B, C], 'foobar');
			assert.equal(setMap.has([C, A, B]), true);
			assert.equal(setMap.has([B, A, C]), true);
			assert.equal(setMap.has([C, B, A]), true);
		});

		it('returns false when sets do not match', function () {
			setMap.set([A, B, C], 'foobar');
			assert.equal(setMap.has([A, B, C, D]), false, 'Path has more items');
			assert.equal(setMap.has([A, B]), false, 'Path does not have enough items');
			assert.equal(setMap.has([A, B, D]), false, 'Path has differing items');
		});
	});

	describe('#delete', function () {
		it('returns false when given an undefined path', function () {
			assert.equal(setMap.delete([A]), false);
			assert.equal(setMap.delete([B]), false);
			assert.equal(setMap.delete([C]), false);
			assert.equal(setMap.delete([A, B, C]), false);
		});

		it('returns true when given a defined path', function () {
			setMap.set([A, B, C], 'foobar');
			assert.equal(setMap.delete([A, B, C]), true);
		});

		it('returns true when given a defined path first, then false', function () {
			setMap.set([A, B, C], 'foobar');
			assert.equal(setMap.delete([A, B, C]), true);
			assert.equal(setMap.delete([A, B, C]), false);
		});

		it('removes the value at the given path', function () {
			setMap.set([A, B, C], 'foobar');
			assert.equal(setMap.get([A, B, C]), 'foobar', 'Get value before deleting it');
			setMap.delete([A, B, C]);
			assert.notEqual(setMap.get([A, B, C]), 'foobar', 'Get value after deleting it');
		});

		it('undefines the value at the given path', function () {
			setMap.set([A, B, C], 'foobar');
			setMap.delete([A, B, C]);
			assert.equal(setMap.get([A, B, C]), undefined);
		});

		it('removes the value when given a similar path', function () {
			setMap.set([A, B, C], 'foobar');
			setMap.delete([B, A, C]);
			assert.notEqual(setMap.get([A, B, C]), 'foobar', 'Get value after deleting it');
		});
	});

	describe('#deleteAll', function () {
		it('returns false when given an undefined item', function () {
			assert.equal(setMap.deleteAll(A), false);
			assert.equal(setMap.deleteAll(B), false);
			assert.equal(setMap.deleteAll(C), false);
			assert.equal(setMap.deleteAll(D), false);
		});

		it('returns true when given a defined item', function () {
			setMap.set([A, B, C], 'foobar');
			assert.equal(setMap.deleteAll(A), true);
		});

		it('returns true when given a defined item first, then false', function () {
			setMap.set([A, B, C], 'foobar');
			assert.equal(setMap.deleteAll(A), true);
			assert.equal(setMap.deleteAll(A), false);
			assert.equal(setMap.deleteAll(B), false);
			assert.equal(setMap.deleteAll(C), false);
		});

		it('removes any value with the given item', function () {
			setMap.set([A, B, C], 'foobar');
			assert.equal(setMap.get([A, B, C]), 'foobar', 'Get value before deleting it');
			setMap.deleteAll(A);
			assert.notEqual(setMap.get([A, B, C]), 'foobar', 'Get value after deleting it');
		});

		it('undefines any value with the given item', function () {
			setMap.set([A, B, C], 'foobar');
			setMap.deleteAll(A);
			assert.equal(setMap.get([A, B, C]), undefined);
		});

		it('removes the value when given any item', function () {
			setMap.set([A, B, C], 'foobar');
			setMap.deleteAll(B);
			assert.notEqual(setMap.get([A, B, C]), 'foobar', 'Get value after deleting it');
		});
	});
});
