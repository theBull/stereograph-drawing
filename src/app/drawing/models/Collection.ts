/// <reference path='./models.ts' />

module Common.Models {

	export class Collection<T extends Common.Interfaces.IModifiable>
		extends Common.Models.Modifiable
		implements Common.Interfaces.ICollection<T> {

		private _count: number;
		private _keys: Array<string | number>;

		constructor(size?: number) {
			if (Common.Utilities.isNotNullOrUndefined(size) && size < 0)
				throw new Error('Collection constructor(): Cannot create a collection with size < 0');

			super();
			super.setContext(this);
			this._count = 0;
			this._keys = new Array(size || 0);
		}
		public copy(newCollection?: Common.Models.Collection<T>): Common.Models.Collection<T> {
			let copyCollection = newCollection || new Common.Models.Collection<T>();
			return <Common.Models.Collection<T>>super.copy(copyCollection, this);
		}
		private _getKey(data: T) {
			if (data && data.guid) {
				return data.guid;
			}
			else {
				//throw new Error('Object does not have a guid');
				console.error('Object does not have a guid');
			}
		}
		private _ensureKeyType(key: string | number) {
			if (typeof key == 'string') {
				// could be valid string 'foo' or number hidden as string '2'
				// convert '2' to 2
				let k = key.toString();
				let ki = parseInt(k);

				key = isNaN(ki) || k.indexOf('-') > -1 ? k : ki;
			}
			return key;
		}
		public size(): number {
			return this._count;
		}
		public isEmpty(): boolean {
			return this.size() == 0;
		}
		public hasElements(): boolean {
			return this.size() > 0;
		}
		public exists(key: string | number): boolean {
			return this.contains(key);
		}
		public first(): T {
			return this.getOne();
		}
		public indexOf(key: string | number): number {
			return this._keys.indexOf(key);
		}
		public isLast(key: string | number): boolean {
			return this.indexOf(key) == this.size() - 1;
		}
		public isFirst(key: string | number): boolean {
			return this.indexOf(key) == 0;
		}
		public get(key: string | number): T {
			key = this._ensureKeyType(key);
			return this[key];
		}
		public getNext(key: string | number): T {
			let next = null;
			if (this.hasElements()) {
				if (this.isLast(key)) {
					next = this.getLast();
				} else {
					next = this.getIndex(this.indexOf(key) + 1);
				}
			}

			return next;
		}
		public getPrevious(key: string | number): T {
			let prev = null;
			if(this.hasElements()) {
				if (!this.isFirst(key))
					prev = this.getIndex(this.indexOf(key) - 1);
			}
			return prev;
		}
		public getOne(): T {
			return this[this._keys[0]];
		}
		public getIndex(index: number): T {
			return this.get(this._keys[index]);
		}
		public getAll(): { any?: T } {
			let obj = {};
			for (let i = 0; i < this._keys.length; i++) {
				let key = this._keys[i];				
				// shitty way of hiding private properties
				obj[key] = this.get(key);
			}
			return obj;
		}
		/**
		 * Retrieves the last element in the collection
		 * @return {T} [description]
		 */
		public getLast(): T {
			let key = this._keys[this._keys.length - 1];
			return this.get(key);
		}
		public set(key: string | number, data: T, listen?: boolean) {
			if (!this.hasOwnProperty(key.toString()))
				throw Error('Object does not have key ' + key + '. Use the add(key) method.');

			this[key] = data;
			
			let self = this;
			data.onModified(function() {
				self.setModified(true);
			});

			if(listen !== false)
				this.setModified(true);
		}
		public replace(replaceKey: string | number, data: T) {
			let key = this._getKey(data);
			this._keys[this._keys.indexOf(replaceKey)] = key;
			this[key] = data;
			delete this[replaceKey];

			let self = this;
			data.onModified(function() {
				self.setModified(true);
			});
			this.setModified(true);
		}
		public setAtIndex(index: number, data: T) {
			if (index < 0 || index > this._count - 1)
				throw new Error('Collection setAtIndex(): index is out of bounds; ' + index);

			let key = this._keys[index];
			if (Common.Utilities.isNullOrUndefined(key))
				return null;

			this.set(key, data);
		}
		public add(data: T, listen?: boolean) {
			let key = this._getKey(data);
			if(this[key] && this._keys.indexOf(key) > -1) {
				this.set(key, data, listen);
			} else {
				this[key] = data;
				
				// NOTE:
				// Here, we must consider that since the collection can
				// be initialized with a given size, we don't want to just
				// arbitrarily 'push()' the added data on to the end of the
				// array; instead, we must use the internal _count variable
				// which keeps track of the actual number of elements in the
				// array, regardless of its initialized size, and always
				// add the new element at the index after the last-inserted
				// element.
				this._keys[this._count] = key;

				this._count++;	
				let self = this;
				data.onModified(function(item) {
					self.setModified(true);
				});
				
				if(listen !== false)
					this.setModified(true);
			}			

		}
		public addAll(elements: T[]) {
			if (!elements || elements.length < 1)
				return;

			for (let i = 0; i < elements.length; i++) {
				let item = elements[i];
				if (item) {
					// this.add(item, false) <- NOTE: false
					// defer the set modification until 
					// after all items have been added
					this.add(item, false);
				}
			}

			this.setModified(true);
		}
		public addAtIndex(data: T, index: number) {
			let key = this._getKey(data);

			let exists = this._keys.indexOf(key) > -1;
			if (!exists || this._keys.indexOf(key) == index) {
				// element exists at that index, update	
				// OR, element does not exist, add at index
				this[key] = data;
				this._keys[index] = key;

				if (!exists) {
					this._count++;

					let self = this;
					data.onModified(function() {
						self.setModified(true);
					});
					this.setModified(true);
				}
			} else {
				// element exists at different index...
				// ignore for now...
				let currentIndex = this._keys.indexOf(key);
				throw new Error([
					'The element you want to add at this',
					' index already exists at index (',
					currentIndex,
					'). Ignoring for now...'
				].join(''));
			}
		}
		public only(data: T): void {
			this.removeAll();
			this.add(data);
		}
		public append(collection: Common.Models.Collection<T>) {
			// adds the given collection onto the end of this collection
			// E.g.
			// this -> [1, 2, 3]
			// collection -> [4, 5, 6]
			// this.append(collection) -> [1, 2, 3, 4, 5, 6]
			let self = this;
			collection.forEach(function(item: T, index) {
				if(item && item.guid) {
					if(this.clearListeners) {
						item.clearListeners();
					}
					self.add(item);	
				} else {
					throw new Error('item is null or does not have guid');
				}
			});
		}
		public forEach(iterator: Function): void {
			if (!this._keys)
				return;

			for (let i = 0; i < this._keys.length; i++) {
				let key = this._keys[i];
				iterator(this[key], i);
			}
		}
		public hasElementWhich(predicate: Function): boolean {
			return this.filterFirst(predicate) != null;
		}
		public filter(predicate: Function): T[] {
			let results = [];
			this.forEach(function(element: T, index) {
				if(predicate(element)) {
					results.push(element);
				}
			});
			return results;
		}
		public filterFirst(predicate: Function): T {
			let results = this.filter(predicate);
			return results && results.length > 0 ? results[0] : null;
		}
		/**
		 * Assumes a 1-deep object: {A: 1, B: 2, C: 3}
		 * 
		 * @param {any} obj [description]
		 */
		public filterCollection(obj: any): Collection<T> {
			if (Common.Utilities.isNullOrUndefined(obj))
				return;

			let newCollection = new Common.Models.Collection<T>();
			let results = [];
			this.forEach(function(item: T, index: number) {
				for (let key in obj) {
					
					let matches = false;
						
					if(typeof item[key] == typeof obj[key]) {
						
						switch (typeof item[key]) {
							case 'string':
								matches = item[key].indexOf(obj[key]) > -1;
								break;
							case 'number':
								matches = item[key] === obj[key];
								break;
						}

					}

					if (matches) {
						results.push(item.guid);
						return;
					}
				}
			});

			if(Common.Utilities.isNotNullOrUndefined(results) && results.length > 0) {
				for (let i = 0; i < results.length; i++) {
					newCollection.add(this.get(results[i]), false);
				}
			}

			return newCollection;
		}
		public remove(key: string | number, listen?: boolean): T {
			if (!this[key]) {
				console.warn('Collection remove(): Tried to remove item, \
					but item with guid does not exist: ', key);
				return;
			}

			let obj = this[key];
			delete this[key];
			this._keys.splice(this._keys.indexOf(key), 1);

			this._count--;

			if(listen !== false)
				this.setModified(true);

			return obj;
		}
		public pop(): T {
			let key = this._keys[this._count - 1];
			return this.remove(key);
		}
		public empty(listen?: boolean): void {
			this.removeAll(listen);
		}
		public removeAll(listen?: boolean): void {
			while (this._count > 0) {
				let key = this._keys[0];
				this.remove(key, listen);
			}
		}
		/**
		 * Allows you to run an iterator method over each item
		 * in the collection before the collection is completely
		 * emptied.
		 */
		public removeEach(iterator: Function, listen?: boolean): void {
			// first, run the iterator over each item in the
			// collection
			this.forEach(iterator); 

			// now remove all of them
			this.removeAll(listen);
		}
		public removeWhere(predicate: Function, listen?: boolean): void {
			let i = 0;
			let elementsToRemove = this.filter(predicate);
			for(let i = 0; i < elementsToRemove.length; i++) {
				let elementToRemove = elementsToRemove[i];
				if(Common.Utilities.isNotNullOrUndefined(elementToRemove)) {
					if(elementToRemove.guid)
						this.remove(elementToRemove.guid, listen);
				}
			}
		}
		public contains(key: string | number): boolean {
			return this[key] != null && this[key] != undefined;
		}
		public toArray(): T[] {
			let arr = [];
			for (var i = 0; i < this._keys.length; i++) {
				arr.push(this.get(this._keys[i]));
			}
			return arr;
		}
		public toJson(): any {
			let results = [];
			this.forEach(function(element, index) {
				results.push(element ? element.toJson() : null);
			});
			return results;
		}

		public getGuids(): Array<string | number> {
			return this._keys;
		}
	}
}