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