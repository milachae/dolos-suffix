import Iterator = NodeJS.Iterator;


export class TupleMap<K, Q> {

    private map: Map<string, Q> = new Map<string, Q>();

    get size() {
        return this.map.size;
    };

    private encodeKey( [k1, k2]: [K,K]){
        return k1 < k2 ? `${k1}-${k2}` : `${k2}-${k1}`;
    }

    private decodeKey(key: string): [K,K] {
        const k = key.split("-")
        return [k[0] as K, k[1] as K];
    }

    set(key: [K,K], value: Q) {
        this.map.set(this.encodeKey(key), value);
        return this;
    }

    clear() {
        this.map.clear()
    }

    delete(key: [K,K]): boolean {
        return this.map.delete(this.encodeKey(key));
    }

    forEach(callbackfn: (value: Q, key: [K, K], map: TupleMap<K, Q>) => void, thisArg?: any): void {
        this.map.forEach((value, key) => {
            callbackfn.call(thisArg, value, this.decodeKey(key), this);
        });
    }

    get(key: [K,K]): Q | undefined {
        return this.map.get(this.encodeKey(key));
    }

    has(key: [K,K]): boolean {
        return this.map.has(this.encodeKey(key));
    }

    keys(): IterableIterator<[K, K]> {
        return (function* (this: TupleMap<K, Q>) {
            for (const key of this.map.keys()) {
                yield this.decodeKey(key);
            }
        }).call(this);
    }

    entries(): IterableIterator<[[K, K], Q]> {
        return (function* (this: TupleMap<K, Q>): IterableIterator<[[K, K], Q]> {
            for (const [key, value] of this.map.entries()) {
                yield [this.decodeKey(key), value];
            }
        }).call(this);
    }

    [Symbol.iterator](): IterableIterator<[[K, K], Q]> {
        return this.entries();
    }

    values(): IterableIterator<Q> {
        return this.map.values();
    }

    get [Symbol.toStringTag](): string {
        return this.map[Symbol.toStringTag];
    }

    toObject() {
        let res: { [key: string]: Q } = {};

        for (const [key, value] of this.map.entries()) {
            res[key] = value;
        }
        return res;
    }
}