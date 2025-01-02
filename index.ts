import {SuffixTree} from "./src/lib/suffixTree.js";
import {testAllSubstrings} from "./src/test/_util.js";

function  benchmark(): void {
    let text: string = "";
    const chars = "ABC";

    for (let i = 0; i < 100000; i++) {
        text += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const tree: SuffixTree = new SuffixTree([text]);
}

function main(): void {
    const inputs = [ 'EAE', 'EAC', 'AAC' ];
    const tree: SuffixTree = new SuffixTree(inputs);
}

main()
