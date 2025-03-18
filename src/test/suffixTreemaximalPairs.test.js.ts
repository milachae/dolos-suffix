import test from "ava";
import {SuffixTree, MaximalPair} from "../lib/suffixTree.js";
import {generateRandomString, stringToNumbers} from "./_util.js";

test("Should find the maximal pairs in one sequence", t => {
    const input = [[5 ,1, 2, 3, 6, 1, 2, 3, 7]]
    const suffixTree = new SuffixTree(input)
    const actual = suffixTree.maximalPairs()
    const expected: MaximalPair[] =[{start1: 5, start2: 1, length: 3}]
    t.deepEqual(actual, expected)
})

test("Should find maximal pairs at start and end of the sequence", t => {
    const input = [[1, 2, 3, 6, 1, 2, 3]]
    const suffixTree = new SuffixTree(input)
    const actual = suffixTree.maximalPairs()
    const expected: MaximalPair[] =[{start1: 4, start2: 0, length: 3}]
    t.deepEqual(actual, expected)
})

test("Should find multiple maximum pairs when the sequence occurs 3 times", t => {
    const input = [[1, 2, 3, 6, 1, 2, 3, 7, 1, 2, 3]]
    const suffixTree = new SuffixTree(input)
    const actual = suffixTree.maximalPairs()
    const expected: MaximalPair[] =[
        {start1: 4, start2: 0, length: 3},
        {start1: 4, start2: 8, length: 3},
        {start1: 0, start2: 8, length: 3}
    ]
    t.deepEqual(actual, expected)
})

test("Should find only the maximal pairs", t => {
    const input = stringToNumbers("xabcyizabcqabcyr")
    const suffixTree = new SuffixTree([input])
    const actual = suffixTree.maximalPairs()
    const expected: MaximalPair[] =[
        {start1: 11, start2: 1, length: 4},
        {start1: 7, start2: 11, length: 3},
        {start1: 7, start2: 1, length: 3}
    ]
    t.deepEqual(actual, expected)
})
