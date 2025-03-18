import test from "ava";
import {generateRandomStrings, longestCommonSubstringLengthDyn, stringsToNumbers} from "./_util.js";
import {SuffixTree} from "../lib/suffixTree.js";

test("Should find common longest substring of 2 strings", t => {
    const inputs = stringsToNumbers([ 'CAECEABD', 'BAECEABC']);
    const tree: SuffixTree = new SuffixTree(inputs);
    t.is(tree.longestCommonSubstring(0, 1), 6);
})

test("Should correctly assign inputs when a path slices", t => {
    const inputs = stringsToNumbers([ 'ABCABD', 'AD' ]);
    const tree: SuffixTree = new SuffixTree(inputs);
    t.is(tree.longestCommonSubstring(0, 1), 1);
})

test("Should have the correct inputs at the leafs", t => {
    const inputs = stringsToNumbers(['AB', 'FB']);

    const tree: SuffixTree = new SuffixTree(inputs);
    t.is(tree.longestCommonSubstring(0,1), longestCommonSubstringLengthDyn(inputs[0], inputs[1]));
})

test("Should handle this extra edge case", t=> {
    const inputs = stringsToNumbers(['CBAB', 'CBAA','BBBA', 'CCBA']);

    const tree: SuffixTree = new SuffixTree(inputs);
    t.is(tree.longestCommonSubstring(2,3), longestCommonSubstringLengthDyn(inputs[2], inputs[3]));
})

test("Should handle this random test", t => {
    const inputs = generateRandomStrings(100,100, 300);
    const tree: SuffixTree = new SuffixTree(inputs);

    for (let i = 0; i < inputs.length-1; i++) {
        t.is(tree.longestCommonSubstring(i, i+1), longestCommonSubstringLengthDyn(inputs[i], inputs[i+1]));
    }
})

test("small failing case", t => {
    const inputs = [
        [2,3,4],
        [1,2,3,4]
    ];
    const tree: SuffixTree = new SuffixTree(inputs);

    for (let i = 0; i < inputs.length-1; i++) {
        t.is(tree.longestCommonSubstring(i, i+1), longestCommonSubstringLengthDyn(inputs[i], inputs[i+1]));
    }
})

test("Should calculate the longest common substrings all at once simple", t => {
    const inputs = stringsToNumbers(['CBAB', 'CBAA','BBBA', 'CCBA']);
    const tree: SuffixTree = new SuffixTree(inputs);

    const expected: number[][] = [
        [0,3,2,3],
        [3,0,2,3],
        [2,2,0,2],
        [3,3,2,0]
    ]
    const result: number[][] = tree.allLongestCommonSubstrings();
    t.deepEqual(result, expected);
})

test("Should calculate the longest common substrings all at once random", t => {
    const inputs = generateRandomStrings(10,10, 5);
    const tree: SuffixTree = new SuffixTree(inputs);

    const expected: number[][] = Array.from({ length: inputs.length }, () => Array(inputs.length).fill(0));
    for (let i = 0; i < inputs.length; i++) {
        for (let j = i+1; j < inputs.length; j++) {
            expected[i][j] = longestCommonSubstringLengthDyn(inputs[i], inputs[j]);
            expected[j][i] = expected[i][j];
        }
    }


    const result: number[][] = tree.allLongestCommonSubstrings();
    t.deepEqual(result, expected);
})