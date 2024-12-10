import {SuffixTree} from "./src/lib/suffixTree.js";

function  benchmark(): void {
    let text: string = "";
    const chars = "ABCDE";

    for (let i = 0; i < 5; i++) {
        text += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const tree: SuffixTree = new SuffixTree(text);
    console.log(text);
    tree.print();
}

function main(): void {
    const tree: SuffixTree = new SuffixTree("MISSISSIPPI");
    tree.print();
}

main()
