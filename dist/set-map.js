(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('make-set'), require('sets-equal')) :
	typeof define === 'function' && define.amd ? define(['make-set', 'sets-equal'], factory) :
	(global.SetMap = factory(global.makeSet,global.setsEqual));
}(this, function (makeSet,setsEqual) { 'use strict';

	makeSet = 'default' in makeSet ? makeSet['default'] : makeSet;
	setsEqual = 'default' in setsEqual ? setsEqual['default'] : setsEqual;

	const MAP = Symbol('map');

	class SetMap {
		constructor () {
			this[MAP] = new Map();
		}

		delete (path) {
			const map = this[MAP];
			const keys = map.keys();
			let result = false;
			for (let key of keys) {
				if (setsEqual(key, path)) {
					map.delete(key);
					result = true;
				}
			}
			return result;
		}

		deleteAll (item) {
			const map = this[MAP];
			const keys = map.keys();
			let result = false;
			for (let key of keys) {
				if (key.has(item)) {
					map.delete(key);
					result = true;
				}
			}
			return result;
		}

		get (path) {
			const map = this[MAP];
			const keys = map.keys();
			let result = false;
			for (let key of keys) {
				if (setsEqual(key, path)) {
					return map.get(key);
				}
			}
		}

		has (path) {
			const map = this[MAP];
			const keys = map.keys();
			let result = false;
			for (let key of keys) {
				if (setsEqual(key, path)) {
					return true;
				}
			}
			return false;
		}

		set (path, value) {
			const map = this[MAP];
			const keys = map.keys();
			let result = false;
			for (let key of keys) {
				if (setsEqual(key, path)) {
					map.set(key, value);
					return this;
				}
			}
			map.set(makeSet(path), value);
			return this;
		}
	}

	return SetMap;

}));