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

test()
