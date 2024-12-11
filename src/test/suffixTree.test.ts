import test, {ExecutionContext} from "ava";
import {SuffixTree} from "../lib/suffixTree.js";

function testAllSubstrings(tree: SuffixTree, text:string, t: ExecutionContext) {
    for (let i = 0; i < text.length; i++) {
        for (let j = i+1; j < text.length; j++) {
            t.true(tree.hasSubstring(text.substring(i, j)));
        }
    }
}

function testAllSuffixes(tree: SuffixTree, text:string, t: ExecutionContext) {
    for (let i = 0; i <= text.length; i++) {
        t.true(tree.hasSuffix(text.substring(i, text.length)));
    }
}

test("Construct suffix tree with one character", t => {
    /*
                  Root
                  |  \
              (a$)|   \ ($)
                  |    \
                  0,2     1,2
     */
    const tree: SuffixTree = new SuffixTree("a");
    t.is(tree.root.children.size, 2);
    t.true(tree.root.children.has("a"));
    t.true(tree.root.children.get("a")!.start === 0);
    t.true(tree.root.children.get("a")!.end.value === 2);

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
    const tree: SuffixTree = new SuffixTree("abc");
    t.is(tree.root.children.size, 4);
    t.true(tree.root.children.has("a"));
    t.true(tree.root.children.has("b"));
    t.true(tree.root.children.has("c"));
    t.true(tree.root.children.has("$"));

    t.true(tree.root.children.get("a")!.start === 0);
    t.true(tree.root.children.get("a")!.end.value === 4);

    t.true(tree.root.children.get("b")!.start === 1);
    t.true(tree.root.children.get("b")!.end.value === 4);

    t.true(tree.root.children.get("c")!.start === 2);
    t.true(tree.root.children.get("c")!.end.value === 4);

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
    const tree: SuffixTree = new SuffixTree("aa");
    t.is(tree.root.children.size, 2);
    t.true(tree.root.children.has("a"));
    t.true(tree.root.children.get("a")!.start === 0);
    t.true(tree.root.children.get("a")!.end.value === 1);
    t.true(tree.root.children.get("a")!.children.size === 2);

    t.true(tree.root.children.get("a")!.children.get("a")!.children.size === 0);
    t.true(tree.root.children.get("a")!.children.get("a")!.start === 1);
    t.true(tree.root.children.get("a")!.children.get("a")!.end.value === 3);


    t.true(tree.root.children.get("a")!.children.get("$")!.children.size === 0);
    t.true(tree.root.children.get("a")!.children.get("$")!.start === 2);
    t.true(tree.root.children.get("a")!.children.get("$")!.end.value === 3);

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
    const tree: SuffixTree = new SuffixTree("aba");
    t.is(tree.root.children.size, 3);
    t.true(tree.root.children.has("a"));
    t.true(tree.root.children.get("a")!.start === 0);
    t.true(tree.root.children.get("a")!.end.value === 1);
    t.true(tree.root.children.get("a")!.children.size === 2);

    t.true(tree.root.children.get("a")!.children.get("b")!.children.size === 0);
    t.true(tree.root.children.get("a")!.children.get("b")!.start === 1);
    t.true(tree.root.children.get("a")!.children.get("b")!.end.value === 4);


    t.true(tree.root.children.get("a")!.children.get("$")!.children.size === 0);
    t.true(tree.root.children.get("a")!.children.get("$")!.start === 3);
    t.true(tree.root.children.get("a")!.children.get("$")!.end.value === 4);

    t.true(tree.root.children.has("b"));
    t.true(tree.root.children.get("b")!.start === 1);
    t.true(tree.root.children.get("b")!.end.value === 4);

    t.true(tree.root.children.has("$"));
    t.true(tree.root.children.get("$")!.start === 3);
    t.true(tree.root.children.get("$")!.end.value === 4);
})

test("Construct suffix tree of abcabxabcd and find every substring and suffix", t => {
    // abcabxabcd
    let text = "abcabxabcd";
    const tree: SuffixTree = new SuffixTree(text);

    testAllSubstrings(tree, text, t);
    testAllSuffixes(tree, text, t);
})

test("Construct suffix tree of MISSISSIPPI and find every substring and suffix", t => {
    const text = "MISSISSIPPI";
    const tree: SuffixTree = new SuffixTree(text);

    testAllSubstrings(tree, text, t);
    testAllSuffixes(tree, text, t);
})

test("Construct suffix tree of EEDEE and find every substring and suffix", t => {
    const text = "EEDE";
    const tree: SuffixTree = new SuffixTree(text);

    testAllSubstrings(tree, text, t);
    testAllSuffixes(tree, text, t);
})

test("Construct suffix tree of BAAABAA and find every substring and suffix", t => {
    const text = "BAAABAA";
    const tree: SuffixTree = new SuffixTree(text);

    testAllSubstrings(tree, text, t);
    testAllSuffixes(tree, text, t);
})

test("Should find all suffixes in random strings", t => {
    const chars = "ABCDE";

    for (let j = 0; j < 100; j++) {
        let text: string = "";


        for (let i = 0; i < 1000; i++) {
            text += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        const tree: SuffixTree = new SuffixTree(text);
        testAllSuffixes(tree, text, t);
    }
})




test("Should find all substrings in the tree", t => {
    const tree: SuffixTree = new SuffixTree("aba");
    t.true(tree.hasSubstring(''));
    t.true(tree.hasSubstring('a'));
    t.true(tree.hasSubstring('ab'));
    t.true(tree.hasSubstring('aba'));
    t.true(tree.hasSubstring('ba'));
    t.true(tree.hasSubstring('b'));
})

test("Should not find non existing substrings", t => {
    const tree: SuffixTree = new SuffixTree("aba");
    t.false(tree.hasSubstring('abab'));
    t.false(tree.hasSubstring('aa'));
    t.false(tree.hasSubstring('bb'));
    t.false(tree.hasSubstring('bab'));
    t.false(tree.hasSubstring('abaa'));
})
