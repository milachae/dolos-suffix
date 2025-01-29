import {SuffixTree} from "./src/lib/suffixTree.js";
import {generateRandomStrings, testAllSubstrings} from "./src/test/_util.js";



function main(): void {
    console.time("")
    const strings = generateRandomStrings(10000, 100, 10);
    const tree = new SuffixTree(strings);
    console.timeEnd("")
}
function test(): void {
    const inputs = [ 'CAECEAB', 'BAECEAB' ];
    const tree: SuffixTree = new SuffixTree(inputs);
    tree.print();
}

function test2(): void {
    // const inputs = ['CBAB', 'CBAA','BBBA', 'CCBA']
    const inputs = ['QCBA', 'FCBA']
    const tree: SuffixTree = new SuffixTree(inputs);
    tree.print();
}

function test3(): void {
    const inputs = ['AB', 'CB']
    const tree: SuffixTree = new SuffixTree(inputs);
    tree.print();
}

function test4(): void {
    const inputs = [ 'ABCABD', 'AD' ];
    const tree: SuffixTree = new SuffixTree(inputs);
    tree.print();
}

test4()
