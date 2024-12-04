export function assert(condition: boolean, message?: string): asserts condition {
    if(!condition) {
        throw new Error(message || "Assertion failed");
    }
}

export class SuffixTreeNode {

    public children: Map<string, SuffixTreeNode> = new Map<string, SuffixTreeNode>();
    public suffixLink: SuffixTreeNode | null = null;

    // start inclusive
    // end exlcusive
    constructor(public start: number, public end: { value: number }) {}

    public length(): number {
        return this.end.value - this.start
    }
}


export class SuffixTree {

    public root: SuffixTreeNode;

    private end: { value: number } = { value: 0 };
    private remainingSuffixCount: number = 0;
    private activeNode: SuffixTreeNode;
    private activeEdge: string | null = null;
    private activeLength: number = 0;
    private readonly text:string ;

    constructor(text: string) {
        this.root =  new SuffixTreeNode(0, {value: 0});
        this.activeNode = this.root;
        this.text = text + "$";
        this.build();
    }

    private walkDown() {
        while (this.activeLength >= this.activeNode.children.get(this.activeEdge!)!.length()) {
            this.activeNode = this.activeNode.children.get(this.activeEdge!)!;
            this.activeEdge = this.text[this.activeNode.end.value];
            this.activeLength -= this.activeNode.length();
        }
    }

    private extend(phase: number) {
        this.end.value++;
        this.remainingSuffixCount++;
        let foundStopCondition = false;
        const new_char = this.text[phase];
        let prev_node: SuffixTreeNode|null = null;

        while (this.remainingSuffixCount > 0 && !foundStopCondition){
            const i_letter = phase + 1 - this.remainingSuffixCount;
            
            // APCFALZ (activeNode change for Active Length ZERO)
            if (this.activeLength === 0) {
                this.activeEdge = this.text[i_letter];
            }

            // Check if there is an edge for the activeEdge, if not create one
            if (this.activeNode.children.has(this.activeEdge!)) {
                // RULE 3
                this.walkDown();
                if (this.text[this.activeNode.children.get(this.activeEdge!)!.start + this.activeLength] === new_char) { // is next char the correct char
                    this.activeLength++; // APCFER3
                    foundStopCondition = true;
                } else {
                    const t = this.activeNode.children.get(this.activeEdge!)!

                    let leaf_node = new SuffixTreeNode(i_letter+this.activeLength,this.end);

                    // only add internal node if not last character
                    if (t.end.value !== t.start + this.activeLength) {
                        let internal_node = new SuffixTreeNode(t.start, {value: t.start + this.activeLength});
                        if (prev_node !== null) {
                            prev_node.suffixLink = internal_node;
                        }
                        prev_node = internal_node;

                        internal_node.children.set(new_char, leaf_node);
                        t.start += this.activeLength;
                        internal_node.children.set(this.text[t.start], t);
                        this.activeNode.children.set(this.activeEdge!, internal_node);
                    } else {
                        t.children.set(new_char, leaf_node);
                    }

                    // if ended in middle of edge -> make new internal node

                    this.remainingSuffixCount--;
                    // update activeNode
                    if (this.activeNode === this.root && this.activeLength > 0) { // APCFER2C1
                        this.activeLength--;
                        this.activeEdge = this.text[phase - this.remainingSuffixCount + 1];
                    } else if (this.activeNode !== this.root) { // APCFER2C2
                        this.activeNode = this.activeNode.suffixLink!;
                    }


                }

            } else {
                // RULE 2
                this.activeNode.children.set(this.activeEdge!, new SuffixTreeNode(i_letter, this.end));
                this.remainingSuffixCount--; // leaf created
                if (prev_node !== null) {
                    prev_node.suffixLink = this.activeNode;
                    prev_node = null;
                }
            }
        }
    }

    private build() {
        for (let phase = 0; phase < this.text.length; phase++) {
            this.extend(phase);
        }
    }

    public search(text: string): boolean {

        let index = 0;
        let notInTree = false;
        let currentNode: SuffixTreeNode = this.root;

        while(index < text.length && !notInTree) {
            if (currentNode.children.has(text[index])) {
                currentNode = currentNode.children.get(text[index])! // safe because checked in if;
                let length = currentNode.end.value - currentNode.start;

                const edgeString = this.text.substring(currentNode.start, currentNode.end.value);
                const textString = text.substring(index, index+length)
                if (!edgeString.startsWith(textString)) {
                    notInTree = true;
                }

                index += length;
            } else {
                notInTree = true;
            }
        }

        return !notInTree;
    }

    private printRecursive(node: SuffixTreeNode, depth: number) {
        console.log(`${"    ".repeat(depth)}N (${node.start}, ${node.end.value}): ${this.text.substring(node.start, node.end.value)}`);

        node.children.forEach(node => {this.printRecursive(node, depth + 1);});
    }

    public print() {
        this.printRecursive(this.root, 0);
    }
}