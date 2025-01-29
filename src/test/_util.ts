import {SuffixTree} from "../lib/suffixTree.js";
import {ExecutionContext} from "ava";

export function testAllSubstrings(tree: SuffixTree, inputs:string, t: ExecutionContext): void
export function testAllSubstrings(tree: SuffixTree, inputs:string[], t: ExecutionContext): void
export function testAllSubstrings(tree: SuffixTree, inputs:string | string[], t: ExecutionContext): void {
    inputs = typeof inputs === "string" ? [inputs] : inputs;

    for (const input of inputs) {
        for (let i = 0; i < input.length; i++) {
            for (let j = i+1; j <= input.length; j++) {
                t.true(tree.hasSubstring(input.substring(i, j)));
            }
        }
    }
}

export function testAllSuffixes(tree: SuffixTree, inputs:string, t: ExecutionContext): void;
export function testAllSuffixes(tree: SuffixTree, inputs:string[], t: ExecutionContext): void;
export function testAllSuffixes(tree: SuffixTree, inputs:string | string[], t: ExecutionContext): void {

    inputs = typeof inputs === "string" ? [inputs] : inputs;

    for (const input of inputs) {
        for (let i = 0; i <= input.length; i++) {
            t.true(tree.hasSuffix(input.substring(i, input.length)));
        }
    }
}


export function generateRandomString(string_length: number = 100, alphabet_size: number=26): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".substring(0, alphabet_size);
    let text: string = "";

    for (let i = 0; i < string_length; i++) {
        text += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return text;
}

export function generateRandomStrings(amount: number, string_length: number = 100, alphabet_size: number=26): string[] {
    const strings = [];

    for (let i = 0; i < amount; i++) {
        strings.push(generateRandomString(string_length, alphabet_size));
    }
    return strings;
}

// https://www.geeksforgeeks.org/longest-common-substring-dp-29/
export function getLcsLengthDyn(s1: string, s2: string): number {
    const m = s1.length;
    const n = s2.length;

    // Create a table to store lengths of longest
    // common suffixes of substrings.
    let LCSuf = Array.from(Array(m + 1), () => Array(n + 1).fill(0));
    let res = 0;

    // Build LCSuf[m+1][n+1] in bottom-up fashion.
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (s1[i - 1] === s2[j - 1]) {
                LCSuf[i][j] = LCSuf[i - 1][j - 1] + 1;
                res = Math.max(res, LCSuf[i][j]);
            } else {
                LCSuf[i][j] = 0;
            }
        }
    }

    return res;
}