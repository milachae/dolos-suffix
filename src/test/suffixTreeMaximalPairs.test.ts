/*
import test, {ExecutionContext} from "ava";
import {MaximalPair, SuffixTree} from "../lib/suffixTree.js";
import {stringToNumbers} from "./_util.js"
import {PairArray} from "../lib/PairArray.js";

function maximalPairsStrings(inputs: string[]) {
    const numberInputs = inputs.map(input => stringToNumbers(input))
    const suffixTree = new SuffixTree(numberInputs)
    return suffixTree.maximalPairs()
}

const testMaximalPairsLength = test.macro((t, inputs: string[], length: number) => {
    const actual =maximalPairsStrings(inputs)
    t.is(actual.length, 0);
});

const testMaximalPairsActualExpected = test.macro((t, inputs: string[], expectedResult: PairArray<MaximalPair[]>) => {
    const actual =maximalPairsStrings(inputs)

    for (let i = 0; i < inputs.length; i++) {
        for (let j = i+1; j < inputs.length; j++) {
            compareMaximalPairsArrays(actual.at(i, j), expectedResult.at(i, j), t);
        }
    }
});

function compareMaximalPairsArrays(actual: MaximalPair[], expected: MaximalPair[], t: ExecutionContext) {
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

function objectToPairArray(width: number, o:{ [key: string]: MaximalPair[] } ) {
    let res: PairArray<MaximalPair[]> = new PairArray(width, () => [])

    for (const [key, value] of Object.entries(o)) {
        const keys = key.split("-");
        const i = parseInt(keys[0]);
        const j = parseInt(keys[1]);
        res.set(i, j, value);
    }

    return res;
}

test("Should not find the end character as maximal pair",testMaximalPairsActualExpected, ["abcd", "efgh"], new PairArray(2, () => []));

test(
    "Should not include the end character to the total length in the maximal pair",
    testMaximalPairsActualExpected,
    ["qab", "cab"],
    objectToPairArray(2, {"0-1": [{starts: [{start: 1, input: 0}, {start: 1, input: 1}], length: 2}]})
)

test(
    "Should find maximal pairs between 2 inputs", testMaximalPairsActualExpected,
    ["xabcy", "zabcq"],
    objectToPairArray(2, {"0-1": [{starts: [{start: 1, input: 1}, {start: 1, input: 0}], length: 3}]})

)

test(
    "Should find maximal pairs at the end of a sequence",
    testMaximalPairsActualExpected,
    ["qabc", "zabc"],
    objectToPairArray(2,{"0-1": [{starts: [{start: 1, input: 0}, {start: 1, input: 1}], length: 3}]})
)

test(
    "Should find maximal pairs at the begin of a sequence",
    testMaximalPairsActualExpected,
    ["abcq", "abcz"],
    objectToPairArray(2,{"0-1": [{starts: [{start: 0, input: 1}, {start: 0, input: 0}], length: 3}]})
)

test(
    "Should find the same pair between inputs",
    testMaximalPairsActualExpected,
    ["qabcz", "yabcx", "kabcj"],
    objectToPairArray(3,{
        "0-1":[{starts: [{start: 1, input: 1}, {start: 1, input: 0}], length: 3}],
        "0-2":[{starts: [{start: 1, input: 0}, {start: 1, input: 2}], length: 3}],
        "1-2":[{starts: [{start: 1, input: 1}, {start: 1, input: 2}], length: 3}]
    })
)

test(
    "Should find multiple pairs of the same sequence",
    testMaximalPairsActualExpected,
    ["jABCk", "xABCyABCz"],
    objectToPairArray(2,{
        "0-1": [
            {starts: [{start: 1, input: 1}, {start: 1, input: 0}], length: 3},
            {starts: [{start: 1, input: 0}, {start: 5, input: 1}], length: 3}
        ]
    })
)

test(
    "Should find for every pair of sequence the maximum pairs",
    testMaximalPairsActualExpected,
    ["xabcyi", "zabck", "qabcyj"],
    objectToPairArray(3,{
        "0-1": [{starts: [{start: 1, input: 1}, {start: 1, input: 0}], length: 3}],
        "0-2": [{starts: [{start: 1, input: 2}, {start: 1, input:0}], length: 4}],
        "1-2": [{starts: [{start: 1, input: 1}, {start: 1, input: 2}], length: 3}],
    })
)

test(
    "Should contain the start position of the correct input when in a leaf",
    testMaximalPairsActualExpected,
    ["xABC", "qqABC"],
    objectToPairArray(2,{
        "0-1": [{starts: [{start: 1, input:0}, {start: 2, input: 1}], length: 3}]
    })
)
*/
