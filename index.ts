import {textToNumbers} from "./src/lib/codeToNumbers.js";
import {SuffixTree} from "./src/lib/suffixTree.js";
import {readDir} from "./src/lib/reader.js";
import Parser, {Language} from "tree-sitter";
import Python from "tree-sitter-python";
import Java from "tree-sitter-java";
import C from "tree-sitter-c";

import {Command, Option} from "commander";
import {writeData} from "./src/lib/writer.js";

const program = new Command();

program
    .argument(
       "<path>",
       "Path to the directory with all the input file(s) for the analysis."
    )
    .addOption(
       new Option("-l, --language <language>", "Programming language used in the submitted files.")
           .choices(['java', 'py', 'c']).makeOptionMandatory(true)
    )
    .option(
        "-m, --min-maximal-pair-length <integer>",
        "The minimal length of a maximal pair.",
        x => parseInt(x),
        15
    )
    .option(
        "-o, --output-destination <path>",
        "Directory path to save the output report.",
        "out/"
    )
    .action((path, options) => run(path, { ...options , ...program.opts() }))
   .parse(process.argv)


function run(path: string, options: any) {
   const parser = new Parser();

   const LANGUAGEMAP: {[key: string]: Language} = {
      "java": Java as Language,
      "py": Python as Language,
      "c": C as Language,
   }

   parser.setLanguage(LANGUAGEMAP[options.language]);

   const [files, content] = readDir(path, options.language);
   const codes = content.map(t => textToNumbers(parser, t));

   const suffixTree = new SuffixTree(codes, {minMaximalPairLength: options.minMaximalPairLength});
   const [l, s] = suffixTree.analyse();

    writeData(files, l, s, options.outputDestination);
}

