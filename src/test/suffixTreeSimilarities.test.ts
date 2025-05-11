import test from "ava";
import { SuffixTree } from "../lib/suffixTree.js";
import {stringsToNumbers} from "./_util.js";

test("Should find a similarity of 0 when there are no similar parts", t=> {
    const inputs = stringsToNumbers([ 'ABCDE', 'FGHIJK']);
    const tree: SuffixTree = new SuffixTree(inputs, {minMaximalPairLength: 1});
    t.is(tree.getSimilarities().at(0, 1), 0);
})

test("Should find a similarity of 1 when 2 inputs are identical", t=> {
    const inputs = stringsToNumbers([ 'ABCDE', 'ABCDE']);
    const tree: SuffixTree = new SuffixTree(inputs, {minMaximalPairLength: 1});
    tree.print();
    t.is(tree.getSimilarities().at(0, 1), 1);
})