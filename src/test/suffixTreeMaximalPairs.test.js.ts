import test, {ExecutionContext} from "ava";
import {SuffixTree, MaximalPair} from "../lib/suffixTree.js";
import {stringToNumbers} from "./_util.js"

function compareMaximalPairs(actual: MaximalPair[], expected: MaximalPair[], t: ExecutionContext) {
    t.is(actual.length, expected.length);

    for (const actualPair of actual) {
        let found = false;
        actualPair.starts.sort()
        let i = 0;
        while (!found && i < expected.length) {
            const expectedPair = expected[i];
            expectedPair.starts.sort()
            if (actualPair.length === expectedPair.length &&
                JSON.stringify(expectedPair.starts) === JSON.stringify(actualPair.starts)) {
                found = true;
            }
            i++;
        }
        t.true(found);
    }
}

test("Should not find a pair in the same sequence", t => {
    const input1 = stringToNumbers("xabcyabcz");
    const suffixTree = new SuffixTree([input1]);
    const actual = suffixTree.maximalPairs();

    t.is(actual.length, 0);
})

test("Should not find the end character as maximal pair", t => {
    const input1 = stringToNumbers("abcd")
    const input2 = stringToNumbers("efgh")
    const suffixTree = new SuffixTree([input1, input2])
    const actual = suffixTree.maximalPairs()

    t.is(actual.length, 0);
})

test("Should not include the end character to the total length in the maximal pair", t => {
    const input1 = stringToNumbers("qab")
    const input2 = stringToNumbers("cab")
    const suffixTree = new SuffixTree([input1, input2])
    const actual = suffixTree.maximalPairs()

    const expected: MaximalPair[] =[
        {starts: [{start: 1, input: 0}, {start: 1, input: 1}], length: 2}
    ]
    compareMaximalPairs(actual, expected, t);
    t.deepEqual(actual, expected)
})

test("Should find maximal pairs between 2 inputs", t => {
    const input1 = stringToNumbers("xabcy");
    const input2 = stringToNumbers("zabcq");

    const suffixTree = new SuffixTree([input1, input2]);
    const actual = suffixTree.maximalPairs();

    const expected: MaximalPair[] =[
        {starts: [{start: 1, input: 1}, {start: 1, input: 0}], length: 3}
    ];
    compareMaximalPairs(actual, expected, t);
    t.deepEqual(actual, expected);
})

test("Should find maximal pairs at the end of a sequence", t => {
    const input1 = stringToNumbers("qabc");
    const input2 = stringToNumbers("zabc");

    const suffixTree = new SuffixTree([input1, input2]);
    const actual = suffixTree.maximalPairs();

    const expected: MaximalPair[] =[
        {starts: [{start: 1, input: 0}, {start: 1, input: 1}], length: 3}
    ];
    compareMaximalPairs(actual, expected, t);
    t.deepEqual(actual, expected);
})

test("Should find maximal pairs at the begin of a sequence", t => {
    const input1 = stringToNumbers("abcq");
    const input2 = stringToNumbers("abcz");

    const suffixTree = new SuffixTree([input1, input2]);
    const actual = suffixTree.maximalPairs();

    const expected: MaximalPair[] =[
        {starts: [{start: 0, input: 1}, {start: 0, input: 0}], length: 3}
    ];
    compareMaximalPairs(actual, expected, t);
    t.deepEqual(actual, expected);
})

test("Should find the same pair between inputs", t => {

    const input1 = stringToNumbers("qabcz");
    const input2 = stringToNumbers("yabcx");
    const input3 = stringToNumbers("kabcj");

    const suffixTree = new SuffixTree([input1, input2, input3]);
    const actual = suffixTree.maximalPairs();

    const expected: MaximalPair[] = [
        {starts: [{start: 1, input: 1}, {start: 1, input: 0}], length: 3},
        {starts: [{start: 1, input: 1}, {start: 1, input: 2}], length: 3},
        {starts: [{start: 1, input: 0}, {start: 1, input: 2}], length: 3}
    ]
    compareMaximalPairs(actual, expected, t);
    t.deepEqual(actual, expected)

})

test("Should find multiple pairs of the same sequence", t => {
    const input1 = stringToNumbers("jABCk")
    const input2 = stringToNumbers("xABCyABCz")

    const suffixTree = new SuffixTree([input1, input2]);
    const actual = suffixTree.maximalPairs();

    const expected: MaximalPair[] = [
        {starts: [{start: 1, input: 1}, {start: 1, input: 0}], length: 3},
        {starts: [{start: 1, input: 0}, {start: 5, input: 1}], length: 3}
    ]
    compareMaximalPairs(actual, expected, t);
    t.deepEqual(actual, expected)
})

test("Should find for every pair of sequence the maximum pairs", t => {
    const input1 = stringToNumbers("xabcyi")
    const input2 = stringToNumbers("zabck")
    const input3 = stringToNumbers("qabcyj")

    const suffixTree = new SuffixTree([input1, input2, input3])
    const actual = suffixTree.maximalPairs()
    const expected: MaximalPair[] =[
        {starts: [{start: 1, input: 2}, {start: 1, input:0}], length: 4},
        {starts: [{start: 1, input: 1}, {start: 1, input: 2}], length: 3},
        {starts: [{start: 1, input: 1}, {start: 1, input: 0}], length: 3}
    ]
    compareMaximalPairs(actual, expected, t);
    t.deepEqual(actual, expected)
})

test("Should contain the start position of the correct input when in a leaf", t => {
    const input1 = stringToNumbers("xABC")
    const input2 = stringToNumbers("qqABC")

    const suffixTree = new SuffixTree([input1, input2])
    const actual = suffixTree.maximalPairs()

    const expected: MaximalPair[] =[
        {starts: [{start: 1, input:0}, {start: 2, input: 1}], length: 3},
    ]

    t.deepEqual(actual, expected);
    compareMaximalPairs(actual, expected, t);

})