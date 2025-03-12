import {textToNumbers} from "./src/lib/codeToNumbers.js";
import {SuffixTree} from "./src/lib/suffixTree.js";
import {readDir} from "./src/lib/reader.js";
import Parser from "tree-sitter";
// import t from "tree-sitter-typescript";
import Python from "tree-sitter-python";
import {generateRandomStrings} from "./src/test/_util.js";

function runPluto() {
   const parser = new Parser();
   parser.setLanguage(Python);

   const [files, content] = readDir("../dolos-benchmark/datasets/plutokiller");
   const codes = content.map(t => textToNumbers(parser, t));

   console.time("pluto");
   const suffixTree = new SuffixTree(codes);
   console.timeEnd("pluto");

   console.time("lcs");
   const a = suffixTree.allLongestCommonSubstrings();
   console.timeEnd("lcs");
}

function main(): void {

   runPluto();
}

main();
