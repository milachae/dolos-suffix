import {SuffixTree} from "./src/lib/suffixTree.js";

function  benchmark(): void {
    let text: string = "";
    const chars = "ABC";

    for (let i = 0; i < 100000; i++) {
        text += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const tree: SuffixTree = new SuffixTree(text);
}

function main(): void {
    const tree: SuffixTree = new SuffixTree("BAAABAA");
    tree.print();
}

benchmark()
