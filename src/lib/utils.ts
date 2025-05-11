
export function assert(condition: boolean, message?: string): asserts condition {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}

/**
 * Check if a1 starts with a2
 * @param a1
 * @param a2
 * @private
 */
export function arrayStartsWith(a1: number[], a2: number[]): boolean {
    for (let i = 0; i < a2.length; i++) {
        if (a1[i] !== a2[i]) {
            return false;
        }
    }

    return true;
}

export function onlyPositiveNumbers(sequence: number[]): boolean {
    return sequence.every(n => n > 0);
}

export function mergeMapsOfList<Key, Value>(maps: Map<Key, Value[]>[]) {
    let newMap: Map<Key, Value[]> = new Map();

    for (const childMap of maps) {
        for (const [key, value] of childMap) {
            const existing = newMap.get(key) || [];
            newMap.set(key, existing.concat(value));
        }
    }

    return newMap;
}
