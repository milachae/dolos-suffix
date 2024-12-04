import test from "ava";
import {SuffixTree} from "../lib/suffixTree.js";

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

test("Construct suffix tree of abcabxabcd", t => {
    // abcabxabcd
    const tree: SuffixTree = new SuffixTree("abcabxabcd");
    t.true(tree.search("cd"));
})

test("Should find all substrings in the tree", t => {
    const tree: SuffixTree = new SuffixTree("aba");
    t.true(tree.search(''));
    t.true(tree.search('a'));
    t.true(tree.search('ab'));
    t.true(tree.search('aba'));
    t.true(tree.search('ba'));
    t.true(tree.search('b'));
})

test("Should not find non existing substrings", t => {
    const tree: SuffixTree = new SuffixTree("aba");
    t.false(tree.search('abab'));
    t.false(tree.search('aa'));
    t.false(tree.search('bb'));
    t.false(tree.search('bab'));
    t.false(tree.search('abaa'));
})

test("Should not find a string with end character ($)", t => {
    const tree: SuffixTree = new SuffixTree("ab");
    t.false(tree.search('$'));
})
