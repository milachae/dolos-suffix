import test from "ava";
import {SuffixTree} from "../lib/suffixTree.js";
import {ExecutionContext} from "ava";

export function testAllSubstrings(tree: SuffixTree, text:string, t: ExecutionContext) {
    for (let i = 0; i < text.length; i++) {
        for (let j = i+1; j <= text.length; j++) {
            t.true(tree.hasSubstring(text.substring(i, j)));
        }
    }
}

export function testAllSuffixes(tree: SuffixTree, text:string, t: ExecutionContext) {
    for (let i = 0; i <= text.length; i++) {
        t.true(tree.hasSuffix(text.substring(i, text.length)));
    }
}

export function generateRandomString(string_length: number = 100): string {
    const chars = "ABCDE";
    let text: string = "";

    for (let i = 0; i < string_length; i++) {
        text += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return text;
}

export function generateRandomStrings(amount: number, string_length: number = 100): string[] {
    const strings = [];

    for (let i = 0; i < amount; i++) {
        strings.push(generateRandomString(string_length));
    }
    return strings;
}