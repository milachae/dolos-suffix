import test, {ExecutionContext} from "ava";
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

    const tree: SuffixTree = new SuffixTree(["a", "b"]);

    const expected: {} = {
        "start": 0,
        "end": 0,
        "file": 0,
        "children": {
            "a": {"start": 0, "end": 2, "file": 0, "children": {}},
            "b": {"start": 0, "end": 2, "file": 1, "children": {}},
            "$": {"start": 1, "end": 2, "file": 0, "children": {}}
        }
    }

    t.deepEqual(tree.toObject(), expected);

    t.is(tree.root.children.size, 3);
    t.true(tree.root.children.has("a"));
    t.true(tree.root.children.get("a")!.start === 0);
    t.true(tree.root.children.get("a")!.end.value === 2);

    t.true(tree.root.children.get("b")!.file === 1);
    t.true(tree.root.children.get("b")!.start === 0);
    t.true(tree.root.children.get("b")!.end.value === 2);

    t.true(tree.root.children.has("$"));
    t.true(tree.root.children.get("$")!.start === 1);
    t.true(tree.root.children.get("$")!.end.value === 2);
})

test("Construct suffix tree with 2 strings with different character", t => {
    const tree: SuffixTree = new SuffixTree(["abc", "efg"]);

    const expected: {} = {
        "start": 0,
        "end": 0,
        "file": 0,
        "children": {
            "a": {"start": 0, "end": 4, "file": 0, "children": {}},
            "b": {"start": 1, "end": 4, "file": 0, "children": {}},
            "c": {"start": 2, "end": 4, "file": 0, "children": {}},
            "e": {"start": 0, "end": 4, "file": 1, "children": {}},
            "f": {"start": 1, "end": 4, "file": 1, "children": {}},
            "g": {"start": 2, "end": 4, "file": 1, "children": {}},
            "$": {"start": 3, "end": 4, "file": 0, "children": {}}
        }
    }

    t.deepEqual(tree.toObject(), expected);
})

test("Construct suffix tree with 2 strings with overlapping prefixes", t => {
    const tree: SuffixTree = new SuffixTree(["abc", "abd"]);

    const expected: {} = {
        "start": 0,
        "end": 0,
        "file": 0,
        "children": {
            "a": {"start": 0, "end": 2, "file": 0, "children": {
                    "d": {"start": 2, "end": 4, "file": 1, "children": {}},
                    "c": {"start": 2, "end": 4, "file": 0, "children": {}}
                }},
            "b": {"start": 1, "end": 2, "file": 0, "children": {
                    "d": {"start": 2, "end": 4, "file": 1, "children": {}},
                    "c": {"start": 2, "end": 4, "file": 0, "children": {}}
                }},
            "c": {"start": 2, "end": 4, "file": 0, "children": {}},
            "d": {"start": 2, "end": 4, "file": 1, "children": {}},
            "$": {"start": 3, "end": 4, "file": 0, "children": {}}
        }
    }

    t.deepEqual(tree.toObject(), expected);
})

test("Construct suffix tree with 2 strings with overlapping substrings", t => {
    const tree: SuffixTree = new SuffixTree(["abc", "dba"]);

    const expected: {} = {
        "start": 0,
        "end": 0,
        "file": 0,
        "children": {
            "a": {"start": 0, "end": 1, "file": 0, "children": {
                    "b": {"start": 1, "end": 4, "file": 0, "children": {}},
                    "$": {"start": 3, "end": 4, "file": 1, "children": {}}
                }},
            "d": {"start": 0, "end": 4, "file": 1, "children": {}},
            "b": {"start": 1, "end": 2, "file": 0, "children": {
                    "c": {"start": 2, "end": 4, "file": 0, "children": {}},
                    "a": {"start": 2, "end": 4, "file": 1, "children": {}},
                }},
            "c": {"start": 2, "end": 4, "file": 0, "children": {}},
            "$": {"start": 3, "end": 4, "file": 0, "children": {}}
        }
    }

    t.deepEqual(tree.toObject(), expected);
})

test("Should find all substrings of 100 random strings of length 100", t => {
    let texts = generateRandomStrings(100);
    const tree: SuffixTree = new SuffixTree(texts);

    for (const text of texts) {
        testAllSubstrings(tree, text, t);
    }
})
