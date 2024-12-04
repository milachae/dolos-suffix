import {SuffixTree} from "./src/lib/suffixTree.js";

function main(): void {
    const tree: SuffixTree = new SuffixTree("abcabxabcd");
    tree.print();
}

main()
