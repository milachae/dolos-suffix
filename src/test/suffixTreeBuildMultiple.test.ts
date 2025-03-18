import test from "ava";
import {SuffixTree} from "../lib/suffixTree.js";
import {
    generateRandomStrings,
    longestCommonSubstringLengthDyn,
    stringsToNumbers,
    testAllSubstrings,
} from "./_util.js";

test("Construct suffix tree with 2 strings with 1 character", t => {
    /*
                  Root
                /  |     \
          (a$)/    | (b$) \ ($)
            /      |       \
      (0) 0,2   (1) 0,2   (0) 1,2
     */

    let inputs = [[1], [2]];
    const tree: SuffixTree = new SuffixTree(inputs);

    const expected: {} = {
        "start": 0,
        "end": 0,
        "input": 0,
        "children": {
            1: {"start": 0, "end": 2, "input": 0, "children": {}},
            2: {"start": 0, "end": 2, "input": 1, "children": {}},
            0: {"start": 1, "end": 2, "input": 0, "children": {}}
        }
    }

    t.deepEqual(tree.toObject(), expected);
    testAllSubstrings(tree, inputs, t);
})

test("Construct suffix tree with 2 strings with different character", t => {
    let inputs = [[1, 2, 3], [4,5,6]];
    const tree: SuffixTree = new SuffixTree(inputs);

    const expected: {} = {
        "start": 0,
        "end": 0,
        "input": 0,
        "children": {
            1: {"start": 0, "end": 4, "input": 0, "children": {}},
            2: {"start": 1, "end": 4, "input": 0, "children": {}},
            3: {"start": 2, "end": 4, "input": 0, "children": {}},
            4: {"start": 0, "end": 4, "input": 1, "children": {}},
            5: {"start": 1, "end": 4, "input": 1, "children": {}},
            6: {"start": 2, "end": 4, "input": 1, "children": {}},
            0: {"start": 3, "end": 4, "input": 0, "children": {}}
        }
    }

    t.deepEqual(tree.toObject(), expected);
    testAllSubstrings(tree, inputs, t);
})

test("Construct suffix tree with 2 strings with overlapping prefixes", t => {
    let inputs = [[1, 2, 3], [1,2,4]];
    const tree: SuffixTree = new SuffixTree(inputs);

    const expected: {} = {
        "start": 0,
        "end": 0,
        "input": 0,
        "children": {
            1: {"start": 0, "end": 2, "input": 0, "children": {
                    4: {"start": 2, "end": 4, "input": 1, "children": {}},
                    3: {"start": 2, "end": 4, "input": 0, "children": {}}
                }},
            2: {"start": 1, "end": 2, "input": 0, "children": {
                    4: {"start": 2, "end": 4, "input": 1, "children": {}},
                    3: {"start": 2, "end": 4, "input": 0, "children": {}}
                }},
            3: {"start": 2, "end": 4, "input": 0, "children": {}},
            4: {"start": 2, "end": 4, "input": 1, "children": {}},
            0: {"start": 3, "end": 4, "input": 0, "children": {}}
        }
    }

    t.deepEqual(tree.toObject(), expected);
    testAllSubstrings(tree, inputs, t);
})

test("Construct suffix tree with 2 strings with overlapping substrings", t => {
    let inputs = [[1, 2, 3], [4,2,1]];
    const tree: SuffixTree = new SuffixTree(inputs);

    const expected: {} = {
        "start": 0,
        "end": 0,
        "input": 0,
        "children": {
            1: {"start": 0, "end": 1, "input": 0, "children": {
                    2: {"start": 1, "end": 4, "input": 0, "children": {}},
                    0: {"start": 3, "end": 4, "input": 1, "children": {}}
                }},
            4: {"start": 0, "end": 4, "input": 1, "children": {}},
            2: {"start": 1, "end": 2, "input": 0, "children": {
                    3: {"start": 2, "end": 4, "input": 0, "children": {}},
                    1: {"start": 2, "end": 4, "input": 1, "children": {}},
                }},
            3: {"start": 2, "end": 4, "input": 0, "children": {}},
            0: {"start": 3, "end": 4, "input": 0, "children": {}}
        }
    }

    t.deepEqual(tree.toObject(), expected);
    testAllSubstrings(tree, inputs, t);
})

test("Construct suffix tree with 3 strings", t => {
    const inputs = [ [5,1,5], [5,1,3], [1,1,3] ];
    const tree: SuffixTree = new SuffixTree(inputs);
    testAllSubstrings(tree, inputs, t);
})

test("Should find all substrings of 100 random strings of length 100", t => {
    const texts = generateRandomStrings(100, 100, 4);
    const tree: SuffixTree = new SuffixTree(texts);

    for (const text of texts) {
        testAllSubstrings(tree, text, t);
    }
})
