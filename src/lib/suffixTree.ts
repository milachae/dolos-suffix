export function assert(condition: boolean, message?: string): asserts condition {
    if(!condition) {
        throw new Error(message || "Assertion failed");
    }
}

let ID: number = 0;

export class SuffixTreeNode {

    public children: Map<string, SuffixTreeNode> = new Map<string, SuffixTreeNode>();
    public suffixLink: SuffixTreeNode | undefined;
    public id: number = 0;

    // start inclusive
    // end exclusive
    constructor(public start: number, public end: { value: number }, public file: number) {
        this.id = ID;
        ID++;
    }

    public length(): number {
        return this.end.value - this.start
    }

    public toObject(): {} {
        let children: {[key: string]: {}} = {};
        for (const [k, child] of this.children) {
            children[k] = child.toObject();
        }
        return {"start": this.start, "end": this.end.value, "file": this.file, "children": children};
    }
}


export class SuffixTree {

    public root: SuffixTreeNode;

    private end: { value: number } = { value: 0 };
    private remainingSuffixCount: number = 0;
    private activeNode: SuffixTreeNode;
    private activeEdge: string;
    private activeEdgeIndex: number;
    private activeLength: number = 0;
    private readonly texts:string[] ;

    constructor(texts: string[]) {
        this.root =  new SuffixTreeNode(0, {value: 0}, 0);
        this.activeNode = this.root;
        this.activeEdge = texts[0];
        this.activeEdgeIndex = 0;
        this.texts = texts.map(text => text + "$");
        this.build();
    }

    private walkDown(file: number) {
        let node_activeEdge = this.activeNode.children.get(this.activeEdge)!;
        while (node_activeEdge !== undefined && this.activeLength >= node_activeEdge.length()) {
            this.activeNode = node_activeEdge;
            this.activeEdgeIndex += this.activeNode.length();
            this.activeEdge = this.texts[file][this.activeEdgeIndex];
            this.activeLength -= this.activeNode.length();
            node_activeEdge = this.activeNode.children.get(this.activeEdge)!;
        }
    }

    private extend(file:number, phase: number) {
        this.end.value++; // RULE 1
        this.remainingSuffixCount++;
        let foundStopCondition = false;
        const new_char = this.texts[file][phase];
        let prev_node: SuffixTreeNode|undefined;

        // Iterate until all suffixes added or Rule 3 executed
        while (this.remainingSuffixCount > 0 && !foundStopCondition){

            // APCFALZ (activeNode change for Active Length ZERO)
            // no walk down needed here (as activeLength is ZERO) and so next character we look for is current character being processed.
            if (this.activeLength === 0) {
                this.activeEdge = this.texts[file][phase]; // TODO: Can this be replaced with new_char??
                this.activeEdgeIndex = phase;
            }

            // walk down the active node
            this.walkDown(file); // APCFWD

            // Check if there is an edge for the activeEdge
            let node_activeEdge = this.activeNode.children.get(this.activeEdge);
            if (node_activeEdge !== undefined) {

                let index_next_char = node_activeEdge.start + this.activeLength;
                if (this.texts[node_activeEdge.file][index_next_char] === new_char) {
                    // RULE 3, next char is already in the suffix tree
                    this.activeLength++; // APCFER3
                    // When rule 3 applies in any phase i, then before we move on to next phase i+1, we increment activeLength by 1.
                    foundStopCondition = true;

                    if (prev_node !== undefined) {
                        prev_node.suffixLink = this.activeNode;
                        prev_node = undefined;
                    }

                } else {
                    // RULE 2
                    let leaf_node = new SuffixTreeNode(phase,this.end, file);
                    let internal_node = new SuffixTreeNode(node_activeEdge.start, {value: index_next_char}, node_activeEdge.file);

                    if (prev_node !== undefined) {
                        prev_node.suffixLink = internal_node;
                    }
                    prev_node = internal_node;

                    internal_node.children.set(new_char, leaf_node);
                    node_activeEdge.start += this.activeLength;
                    internal_node.children.set(this.texts[node_activeEdge.file][node_activeEdge.start], node_activeEdge);
                    this.activeNode.children.set(this.activeEdge, internal_node);
                }

            } else {
                // RULE 2
                this.activeNode.children.set(this.activeEdge, new SuffixTreeNode(phase, this.end, file));
                if (prev_node !== undefined) {
                    prev_node.suffixLink = this.activeNode;
                    prev_node = undefined;
                }
            }

            if (!foundStopCondition) {
                // update activeNode
                this.remainingSuffixCount--; // leaf created

                if (this.activeNode === this.root && this.activeLength > 0) { // APCFER2C1
                    this.activeLength--;
                    this.activeEdgeIndex = phase - this.remainingSuffixCount + 1;
                    this.activeEdge = this.texts[this.activeNode.file][this.activeEdgeIndex];

                } else if (this.activeNode !== this.root) { // APCFER2C2
                    assert(this.activeNode.suffixLink !== undefined); // Sanity check
                    this.activeNode = this.activeNode.suffixLink;
                }
            }
        }
    }

    private build() {
        for (let input_i = 0; input_i < this.texts.length; input_i++) {
            this.end = {value: 0};
            this.activeNode = this.root;
            this.activeLength = 0;
            this.activeEdge = this.texts[input_i];
            this.activeEdgeIndex = 0;
            this.remainingSuffixCount = 0;
            for (let phase = 0; phase <  this.texts[input_i].length; phase++) {
                this.extend(input_i, phase);
            }
        }
    }

    public hasSubstring(text: string): boolean {

        let index = 0;
        let notInTree = false;
        let currentNode: SuffixTreeNode = this.root;

        while(index < text.length && !notInTree) {
            if (currentNode.children.has(text[index])) {
                currentNode = currentNode.children.get(text[index])! // safe because checked in if;
                let length = currentNode.end.value - currentNode.start;

                const edgeString = this.texts[currentNode.file].substring(currentNode.start, currentNode.end.value);
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

    public hasSuffix(text: string): boolean {
        return this.hasSubstring(text + "$");
    }

    private printRecursive(node: SuffixTreeNode, depth: number) {
        const spacing = "    ".repeat(depth);
        const start_stop = `(${node.start}, ${node.end.value})`
        const substring = this.texts[node.file].substring(node.start, node.end.value);
        const suffixlink = node.suffixLink !== undefined ? `-> ${node.suffixLink.id}` : ``;
        if (depth !== 0) {
            console.log(`${spacing}N-${node.id}  ${start_stop}: ${substring} ${suffixlink}`);
        } else {
            console.log(`ROOT`);
        }

        node.children.forEach(node => {this.printRecursive(node, depth + 1);});
    }

    public print() {
        this.printRecursive(this.root, 0);
    }

    public toObject() {
        return this.root.toObject();
    }
}