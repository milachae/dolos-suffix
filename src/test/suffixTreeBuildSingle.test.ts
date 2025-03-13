import test from "ava";
import {SuffixTree} from "../lib/suffixTree.js";
import {generateRandomStrings, stringToNumbers, testAllSubstrings, testAllSuffixes} from "./_util.js";

test("Construct suffix tree with one character", t => {
    /*
                  Root
                  |  \
              (a$)|   \ ($)
                  |    \
                  0,2     1,2
     */
    const tree: SuffixTree = new SuffixTree([[1]]);
    t.is(tree.root.children.size, 2);
    t.true(tree.root.children.has(1));
    t.true(tree.root.children.get(1)!.start === 0);
    t.true(tree.root.children.get(1)!.end.value === 2);

    t.true(tree.root.children.has("$"));
    t.true(tree.root.children.get("$")!.start === 1);
    t.true(tree.root.children.get("$")!.end.value === 2);
})

test("Construct suffix tree with different character", t => {
    /*
                 Root
          /      |     \  \
   (abc$)/  (bc$)| (b$)|   \ ($)
        /        |     |    \
      0,4       1,4   2,4   3,4
    */
    const tree: SuffixTree = new SuffixTree([[1,2,3]]);
    t.is(tree.root.children.size, 4);
    t.true(tree.root.children.has(1));
    t.true(tree.root.children.has(2));
    t.true(tree.root.children.has(3));
    t.true(tree.root.children.has("$"));

    t.true(tree.root.children.get(1)!.start === 0);
    t.true(tree.root.children.get(1)!.end.value === 4);

    t.true(tree.root.children.get(2)!.start === 1);
    t.true(tree.root.children.get(2)!.end.value === 4);

    t.true(tree.root.children.get(3)!.start === 2);
    t.true(tree.root.children.get(3)!.end.value === 4);

    t.true(tree.root.children.get("$")!.start === 3);
    t.true(tree.root.children.get("$")!.end.value === 4);
})

test("Construct suffix tree with multiples of one character", t => {
    /*
              Root
              |  \
          (a) |   \ ($)
              |    \
        (0,1) N     2,3
              |\
         (a$) | \ ($)
              |  \
            1,3  2,3
 */
    const tree: SuffixTree = new SuffixTree([[1,1]]);
    t.is(tree.root.children.size, 2);
    t.true(tree.root.children.has(1));
    t.true(tree.root.children.get(1)!.start === 0);
    t.true(tree.root.children.get(1)!.end.value === 1);
    t.true(tree.root.children.get(1)!.children.size === 2);

    t.true(tree.root.children.get(1)!.children.get(1)!.children.size === 0);
    t.true(tree.root.children.get(1)!.children.get(1)!.start === 1);
    t.true(tree.root.children.get(1)!.children.get(1)!.end.value === 3);


    t.true(tree.root.children.get(1)!.children.get("$")!.children.size === 0);
    t.true(tree.root.children.get(1)!.children.get("$")!.start === 2);
    t.true(tree.root.children.get(1)!.children.get("$")!.end.value === 3);

    t.true(tree.root.children.has("$"));
    t.true(tree.root.children.get("$")!.start === 2);
    t.true(tree.root.children.get("$")!.end.value === 3);
})

test("Construct suffix tree with a repeating character", t => {
    /*
              Root
           /   |     \
      (a) /    |(ba$) \ ($)
          |    |       \
    (0,1) N    1,4     3,4
          |\
    (ba$) | \ ($)
          |  \
        1,4  3,4
    */
    const tree: SuffixTree = new SuffixTree([[1,2,1]]);
    t.is(tree.root.children.size, 3);
    t.true(tree.root.children.has(1));
    t.true(tree.root.children.get(1)!.start === 0);
    t.true(tree.root.children.get(1)!.end.value === 1);
    t.true(tree.root.children.get(1)!.children.size === 2);

    t.true(tree.root.children.get(1)!.children.get(2)!.children.size === 0);
    t.true(tree.root.children.get(1)!.children.get(2)!.start === 1);
    t.true(tree.root.children.get(1)!.children.get(2)!.end.value === 4);


    t.true(tree.root.children.get(1)!.children.get("$")!.children.size === 0);
    t.true(tree.root.children.get(1)!.children.get("$")!.start === 3);
    t.true(tree.root.children.get(1)!.children.get("$")!.end.value === 4);

    t.true(tree.root.children.has(2));
    t.true(tree.root.children.get(2)!.start === 1);
    t.true(tree.root.children.get(2)!.end.value === 4);

    t.true(tree.root.children.has("$"));
    t.true(tree.root.children.get("$")!.start === 3);
    t.true(tree.root.children.get("$")!.end.value === 4);
})

test("Construct suffix tree of abcabxabcd and find every substring and suffix", t => {
    // abcabxabcd
    let text = stringToNumbers("abcabxabcd");
    const tree: SuffixTree = new SuffixTree([text]);

    testAllSubstrings(tree, text, t);
    testAllSuffixes(tree, text, t);
})

test("Construct suffix tree of MISSISSIPPI and find every substring and suffix", t => {
    const text = stringToNumbers("MISSISSIPPI");
    const tree: SuffixTree = new SuffixTree([text]);

    testAllSubstrings(tree, text, t);
    testAllSuffixes(tree, text, t);
})

test("Construct suffix tree of EEDEE and find every substring and suffix", t => {
    const text = stringToNumbers("EEDE");
    const tree: SuffixTree = new SuffixTree([text]);

    testAllSubstrings(tree, text, t);
    testAllSuffixes(tree, text, t);
})

test("Construct suffix tree of BAAABAA and find every substring and suffix", t => {
    const text = stringToNumbers("BAAABAA");
    const tree: SuffixTree = new SuffixTree([text]);

    testAllSubstrings(tree, text, t);
    testAllSuffixes(tree, text, t);
})

test("Should find all substrings in the tree", t => {
    const tree: SuffixTree = new SuffixTree([[1,2,1]]);
    t.true(tree.hasSubstring([]));
    t.true(tree.hasSubstring([1]));
    t.true(tree.hasSubstring([1,2]));
    t.true(tree.hasSubstring([1,2,1]));
    t.true(tree.hasSubstring([2,1]));
    t.true(tree.hasSubstring([2]));
})

test("Should not find non existing substrings", t => {
    const tree: SuffixTree = new SuffixTree([[1,2,1]]);
    t.false(tree.hasSubstring([1,2,1,2]));
    t.false(tree.hasSubstring([1,1]));
    t.false(tree.hasSubstring([2,2]));
    t.false(tree.hasSubstring([2,1,2]));
    t.false(tree.hasSubstring([1,2,1,1]));
})

test("Should find all suffixes in random strings", t => {
    for (const text of generateRandomStrings(100, 1000, 5)) {
        const tree: SuffixTree = new SuffixTree([text]);
        testAllSuffixes(tree, text, t);
    }
})
