import Parser, { SyntaxNode } from "tree-sitter";

export function textToNumbers(parser: Parser, text: string): number[] {
    const tree = parser.parse(
        text,
        undefined,
        { bufferSize: Math.max(32 * 1024, text.length * 2) }
    );
    const numbers: number[] = [];
    nodesToNumbers(tree.rootNode, numbers);
    return numbers;
}

function nodesToNumbers(node: SyntaxNode, numbers: number[]): void{

    numbers.push(node.typeId);

    for (const child of node.namedChildren) {
        nodesToNumbers(child, numbers);
    }
}
