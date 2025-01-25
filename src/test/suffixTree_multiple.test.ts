import test from "ava";
import {SuffixTree} from "../lib/suffixTree.js";
import {generateRandomStrings, testAllSubstrings, testAllSuffixes} from "./_util.js";

test("Construct suffix tree with 2 strings with 1 character", t => {
    /*
                  Root
                /  |     \
          (a$)/    | (b$) \ ($)
            /      |       \
      (0) 0,2   (1) 0,2   (0) 1,2
     */

    let inputs = ["a", "b"];
    const tree: SuffixTree = new SuffixTree(inputs);

    const expected: {} = {
        "start": 0,
        "end": 0,
        "input": 0,
        "children": {
            "a": {"start": 0, "end": 2, "input": 0, "children": {}},
            "b": {"start": 0, "end": 2, "input": 1, "children": {}},
            "$": {"start": 1, "end": 2, "input": 0, "children": {}}
        }
    }

    t.deepEqual(tree.toObject(), expected);
    testAllSubstrings(tree, inputs, t);
})

test("Construct suffix tree with 2 strings with different character", t => {
    let inputs = ["abc", "efg"];
    const tree: SuffixTree = new SuffixTree(inputs);

    const expected: {} = {
        "start": 0,
        "end": 0,
        "input": 0,
        "children": {
            "a": {"start": 0, "end": 4, "input": 0, "children": {}},
            "b": {"start": 1, "end": 4, "input": 0, "children": {}},
            "c": {"start": 2, "end": 4, "input": 0, "children": {}},
            "e": {"start": 0, "end": 4, "input": 1, "children": {}},
            "f": {"start": 1, "end": 4, "input": 1, "children": {}},
            "g": {"start": 2, "end": 4, "input": 1, "children": {}},
            "$": {"start": 3, "end": 4, "input": 0, "children": {}}
        }
    }

    t.deepEqual(tree.toObject(), expected);
    testAllSubstrings(tree, inputs, t);
})

test("Construct suffix tree with 2 strings with overlapping prefixes", t => {
    let inputs = ["abc", "abd"];
    const tree: SuffixTree = new SuffixTree(inputs);

    const expected: {} = {
        "start": 0,
        "end": 0,
        "input": 0,
        "children": {
            "a": {"start": 0, "end": 2, "input": 0, "children": {
                    "d": {"start": 2, "end": 4, "input": 1, "children": {}},
                    "c": {"start": 2, "end": 4, "input": 0, "children": {}}
                }},
            "b": {"start": 1, "end": 2, "input": 0, "children": {
                    "d": {"start": 2, "end": 4, "input": 1, "children": {}},
                    "c": {"start": 2, "end": 4, "input": 0, "children": {}}
                }},
            "c": {"start": 2, "end": 4, "input": 0, "children": {}},
            "d": {"start": 2, "end": 4, "input": 1, "children": {}},
            "$": {"start": 3, "end": 4, "input": 0, "children": {}}
        }
    }

    t.deepEqual(tree.toObject(), expected);
    testAllSubstrings(tree, inputs, t);
})

test("Construct suffix tree with 2 strings with overlapping substrings", t => {
    let inputs = ["abc", "dba"];
    const tree: SuffixTree = new SuffixTree(inputs);

    const expected: {} = {
        "start": 0,
        "end": 0,
        "input": 0,
        "children": {
            "a": {"start": 0, "end": 1, "input": 0, "children": {
                    "b": {"start": 1, "end": 4, "input": 0, "children": {}},
                    "$": {"start": 3, "end": 4, "input": 1, "children": {}}
                }},
            "d": {"start": 0, "end": 4, "input": 1, "children": {}},
            "b": {"start": 1, "end": 2, "input": 0, "children": {
                    "c": {"start": 2, "end": 4, "input": 0, "children": {}},
                    "a": {"start": 2, "end": 4, "input": 1, "children": {}},
                }},
            "c": {"start": 2, "end": 4, "input": 0, "children": {}},
            "$": {"start": 3, "end": 4, "input": 0, "children": {}}
        }
    }

    t.deepEqual(tree.toObject(), expected);
    testAllSubstrings(tree, inputs, t);
})

test("Construct suffix tree with 3 strings", t => {
    const inputs = [ 'EAE', 'EAC', 'AAC' ];
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

test.only("Should find common longest substring of 2 strings", t => {
    const inputs = [ 'CAECEABD', 'BAECEABC' ];
    const tree: SuffixTree = new SuffixTree(inputs);
    t.is(tree.longestCommonSubsequence(0, 1), 6);
})