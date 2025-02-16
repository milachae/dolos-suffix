import {textToNumbers} from "./src/lib/codeToNumbers.js";
import {SuffixTree} from "./src/lib/suffixTree.js";
import {readDir} from "./src/lib/reader.js";
import Parser from "tree-sitter";
// import t from "tree-sitter-typescript";
import Python from "tree-sitter-python";

function main(): void {
   const parser = new Parser();
   parser.setLanguage(Python);

   const texts = readDir("../dolos-benchmark/datasets/plutokiller");

   const codes = texts.map(t => textToNumbers(parser, t));

   console.time("pluto");
   const s = new SuffixTree(codes);
   console.timeEnd("pluto");

   console.time("lcs");
   /*for (let i = 0; i < codes.length; i++) {
      for (let j = i+1; j < codes.length; j++) {
         s.longestCommonSubstring(i,j);
      }
   }*/
   s.allLongestCommonSubstrings()
   console.timeEnd("lcs");
}

main();
