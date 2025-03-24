import {textToNumbers} from "./src/lib/codeToNumbers.js";
import {SuffixTree} from "./src/lib/suffixTree.js";
import {readDir} from "./src/lib/reader.js";
import Parser from "tree-sitter";
import Python from "tree-sitter-python";

function runPluto() {
   const parser = new Parser();
   parser.setLanguage(Python);

   const [files, content] = readDir("../dolos-benchmark/datasets/plutokiller");
   const codes = content.map(t => textToNumbers(parser, t));

   console.time("pluto");
   const suffixTree = new SuffixTree(codes, {minMaximalPairLength: 15});
   console.timeEnd("pluto");

   console.time("lcs");
   const a = suffixTree.allLongestCommonSubstrings();
   console.timeEnd("lcs");

   console.time("pairs");
   const pairs = suffixTree.maximalPairs();
   console.timeEnd("pairs");
}

function main(): void {

   runPluto();
}

main();
