import test from "ava";
import {SuffixTree} from "../lib/suffixTree.js";

test("Construct suffix tree for xabxa", t => {
    const tree: SuffixTree = new SuffixTree("xabxa");
    // t.is(tree.root, tree);
})