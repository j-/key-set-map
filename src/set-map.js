import makeSet from 'make-set';
import setsEqual from 'sets-equal';

const MAP = Symbol('map');

export default class SetMap {
	constructor () {
		this[MAP] = new Map();
	}

	/**
	 * Deletes the value at the given path.
	 * @param {Array|Set} path Index path
	 * @return {Boolean} True if a value was deleted, false otherwise.
	 */
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

	/**
	 * Delete all items in the map where their paths contain a given value.
	 * @param {*} item One of the items in the path for each item to delete
	 * @return {Boolean} True if anything was deleted, false otherwise.
	 */
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

	/**
	 * Gets the value at a given path.
	 * @param {Array|Set} path Index path
	 * @return {*} The value stored at the given path, or `undefined` if none.
	 */
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

	/**
	 * Checks for the existence of an item at the given path.
	 * @param {Array|Set} path Index path
	 * @return {Boolean} True if an item is set at the given path, false
	 *   otherwise.
	 */
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

	/**
	 * Sets or updates an item at the given path.
	 * @param {Array|Set} path Index path
	 * @param {*} value Item to store at the given path
	 * @return {SetMap} Returns the instance for chaining.
	 */
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
