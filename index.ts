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
   const suffixTree = new SuffixTree(codes, {minMaximalPairLength: 8});
   console.timeEnd("pluto");

   console.time("lcs");
   const a = suffixTree.allLongestCommonSubstrings();
   console.timeEnd("lcs");

   console.time("simularities");
   const sims = suffixTree.similarities();
   console.timeEnd("simularities");

   for (let input1 = 0; input1 < sims.length; input1++) {
      for (let input2 = input1+1; input2 < sims.length; input2++) {
         console.log(`${files[input1]} & ${files[input2]}: ${sims[input1][input2]}`);
      }
   }

}

function main(): void {

   runPluto();
}

main();
