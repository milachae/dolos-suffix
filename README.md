# Dolos suffix

This is a prototype I have made for my master thesis where I tested if a suffix tree would be a better index to use in [Dolos](https://github.com/dodona-edu/dolos), a source code plagiarism detection tool for programming exercises made by Rien Maertens.

## Installation

To install the library and its dependencies, npm can be used. You need to build it with `--force` enabled because the different Tree-sitter grammers cause dependency conflicts.

```bash
npm install --force
```

## Usage

- **Build**: Compile the TypeScript code.
  ```bash
  npm run build
  ```
- **Test**: Run the test suite using AVA.
  ```bash
  npm run test
  ```
- **Start**: Build the project and run the similarity tool.
  ```bash
  npm run start -- [options] <path> 
  ```
  You can use the following options:
  ```
  Usage: index [options] <path>
    Arguments:
    path                                     Path to the directory with all the input file(s) for the analysis.
    
    Options:
    -l, --language <language>                Programming language used in the submitted files. (choices: "java", "py", "c")
    -m, --min-maximal-pair-length <integer>  The minimal length of a maximal pair. (default: 15)
    -o, --output-destination <path>          Directory path to save the output report. (default: "out/")
    -h, --help                               display help for command

  ```
