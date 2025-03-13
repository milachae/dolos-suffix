export type iType = (number | "$");

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
export function arrayStartsWith(a1: iType[], a2: iType[]): boolean {
    for (let i = 0; i < a2.length; i++) {
        if (a1[i] !== a2[i]) {
            return false;
        }
    }

    return true;
}