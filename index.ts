import {textToNumbers} from "./src/lib/codeToNumbers.js";
import {SuffixTree} from "./src/lib/suffixTree.js";
import {readDir} from "./src/lib/reader.js";
import Parser, {Language} from "tree-sitter";
import Python from "tree-sitter-python";
import Java from "tree-sitter-java";
import C from "tree-sitter-c";

import {Command, Option} from "commander";

const program = new Command();

program
    .argument(
       "<path>",
       "Input file(s) for the analysis. Can be a list of source code files, " +
       "a CSV-file, or a zip-file with a top level info.csv file."
    )
    .addOption(
       new Option("-l, --language <language>", "Programming language used in the submitted files.")
           .choices(['java', 'python', 'c']).makeOptionMandatory(true)
    )
    .option(
        "-m, --min-maximal-pair-length <integer>",
        "The minimal length of a maximal pair.",
        x => parseInt(x),
        15
    )
    .option(
        "-o, --output-destination <path>",
        "Path where to write the output report to. " +
        "This has no effect when the output format is set to 'terminal'.",
        "out/"
    )
    .action((path, options) => run(path, { ...options , ...program.opts() }))
   .parse(process.argv)

const LANGUAGEMAP: {[key: string]: Language} = {
    "java": Java as Language,
    "python": Python as Language,
    "c": C as Language,
}

function run(path: string, options: any) {
   const parser = new Parser();
   parser.setLanguage(LANGUAGEMAP[options.language]);

   const [files, content] = readDir(path);
   const codes = content.map(t => textToNumbers(parser, t));

   console.time("pluto");
   const suffixTree = new SuffixTree(codes, {minMaximalPairLength: options.minMaximalPairLength});
   console.timeEnd("pluto");

   console.time("lcs");
   const a = suffixTree.allLongestCommonSubstrings();
   console.timeEnd("lcs");

   console.time("simularities");
   const sims = suffixTree.similarities();
   console.timeEnd("simularities");

   for (let input1 = 0; input1 < files.length; input1++) {
      for (let input2 = input1+1; input2 < files.length; input2++) {
         console.log(`${files[input1]} & ${files[input2]}: ${sims.at(input1, input2)}`);
      }
   }
}

