import {textToNumbers} from "./src/lib/codeToNumbers.js";
import {SuffixTree} from "./src/lib/suffixTree.js";
import {readDir} from "./src/lib/reader.js";
import Parser from "tree-sitter";
// import t from "tree-sitter-typescript";
import Python from "tree-sitter-python";

function runPluto() {
   const parser = new Parser();
   parser.setLanguage(Python);

   const texts = readDir("../dolos-benchmark/datasets/plutokiller");
   const codes = texts.map(t => textToNumbers(parser, t));

   console.time("pluto");
   const suffixTree = new SuffixTree(codes);
   console.timeEnd("pluto");

   console.timeEnd("lcs");
   const a = suffixTree.allLongestCommonSubstrings();
   console.timeEnd("lcs");
}

function main(): void {
   const s = new SuffixTree([[7,8,9,10,11,12], [1,2,3, 4,5,6]]);
   console.log(s.compare(0,1))
}

main();
