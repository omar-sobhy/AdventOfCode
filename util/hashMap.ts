

function DefaultEquals<K>(lhs: K, rhs: K): boolean {
    return lhs === rhs;
}

function DefaultHash<K>(lhs: K): string {
    return JSON.stringify(lhs);
}

export default class HashMap<K,
    V,
    Equals extends (lhs: K, rhs: K) => boolean = (lhs: K, rhs: K) => boolean,
    Hash extends (e: K) => string = (e: K) => string,
> {
    private valueMap: Map<string, V[]> = new Map();

    private keyMap: Map<string, K[]> = new Map();

    private equals: Equals;

    private hash: Hash;
    
    constructor(values: Iterable<[K: K, v: V]> = [],
        equals = DefaultEquals as Equals,
        hash = DefaultHash as Hash) {
        this.equals = equals;

        this.hash = hash;

        for (const [k, v] of values) {
            this.set(k, v);
        }
    }

    get(k: K): V | undefined {
        const hash = this.hash(k);

        const possibleValues = this.valueMap.get(hash);

        if (!possibleValues) {
            return undefined;
        }

        const possibleKeys = this.keyMap.get(hash)!;

        const index = possibleKeys.findIndex(k_ => this.equals(k, k_));

        return possibleValues[index];
    }

    set(k: K, v: V): this {
        const hash = this.hash(k);

        if (!this.valueMap.get(hash)) {
            this.valueMap.set(hash, [v]);
        }
        const values = this.valueMap.get(hash)!;

        if (!this.keyMap.get(hash)) {
            this.keyMap.set(hash, [k]);
        }
        const keys = this.keyMap.get(hash)!;

        const index = keys.findIndex(k_ => this.equals(k, k_));

        values[index] = v;

        return this;
    }

    *entries() {
        for (const [hash, keys] of this.keyMap.entries()) {
            const values = this.valueMap.get(hash)!;

            for (let i = 0; i < keys.length; ++i) {
                yield [
                    keys[i],
                    values[i],
                ] as [K, V];
            }
        }
    }
}