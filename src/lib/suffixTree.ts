export function assert(condition: boolean, message?: string): asserts condition {
    if(!condition) {
        throw new Error(message || "Assertion failed");
    }
}

/**
 * Check if a1 starts with a2
 * @param a1
 * @param a2
 * @private
 */
function arrayStartsWith(a1: iType[], a2: iType[]): boolean {
    for (let i = 0; i < a2.length; i++) {
        if (a1[i] !== a2[i]) {
            return false;
        }
    }

    return true;
}


let ID: number = 0;
type iType = (number|"$");

/**
 *
 */
export class SuffixTreeNode {

    public children: Map<iType, SuffixTreeNode> = new Map<iType, SuffixTreeNode>();
    public suffixLink: SuffixTreeNode | undefined;
    public id: number = 0;
    public leaf: boolean = false;
    public inputs: number[];

    // start inclusive
    // end exclusive
    constructor(public start: number, public end: { value: number }, public input: number) {
        this.id = ID;
        ID++;
        this.inputs = [input];
    }

    public length(): number {
        return this.end.value - this.start
    }

    public toObject(): {} {
        let children: {[key: string]: {}} = {};
        for (const [k, child] of this.children) {
            children[k] = child.toObject();
        }
        return {"start": this.start, "end": this.end.value, "input": this.input, "children": children};
    }

    public addInput(...inputs: number[]) {
        for (const input of inputs) {
            if (!this.inputs.includes(input)) {
                this.inputs.push(input);
            }
        }
    }
}


export class SuffixTree {

    public root: SuffixTreeNode = new SuffixTreeNode(0, {value: 0}, 0);

    private readonly texts:iType[][] = [];

    // Variables needed during the building phase
    private end: { value: number } = { value: 0 };
    private remainingSuffixCount: number = 0;
    private activeNode: SuffixTreeNode = this.root;
    private activeEdgeIndex: number = 0;
    private activeLength: number = 0;
    private activeEdge: iType = 0;

    constructor(texts: number[][]) {
        texts.forEach((text) => this.texts.push([...text, "$"]));
        this.root.suffixLink = this.root;
        this.resetBuildVariables(0);
        this.build();
    }

    /**
     *
     * @param i
     * @private
     */
    private resetBuildVariables(i: number) {
        assert(i < this.texts.length);
        this.end = {value: 0};
        this.activeNode = this.root;
        this.activeLength = 0;
        this.activeEdge = this.texts[i][0];
        this.activeEdgeIndex = 0;
        this.remainingSuffixCount = 0;
    }

    /**
     *
     * @param input
     * @private
     */
    private walkDown(input: number) {
        let node_activeEdge = this.activeNode.children.get(this.activeEdge)!;
        while (node_activeEdge !== undefined && this.activeLength >= node_activeEdge.length()) {
            this.activeNode = node_activeEdge;
            this.activeEdgeIndex += this.activeNode.length();
            this.activeEdge = this.texts[input][this.activeEdgeIndex];
            this.activeLength -= this.activeNode.length();
            node_activeEdge = this.activeNode.children.get(this.activeEdge)!;
        }
    }

    /**
     *
     * @param input
     * @param phase
     * @param end
     * @private
     */
    private extend(input:number, phase: number, end: boolean) {

        /*
        During one extension phase, 3 different things can happen. So we have following 3 rules:

        RULE 1: If the path from the root labelled S[j..i] ends at leaf edge
                (i.e. S[i] is last character on leaf edge) then character S[i+1]
                is just added to the end of the label on that leaf edge.

        RULE 2: If the path from the root labelled S[j..i] ends at non-leaf edge
                (i.e. there are more characters after S[i] on path) and next character
                is not s[i+1], then a new leaf edge with label s{i+1] and number j is
                created starting from character S[i+1]. A new internal node will also
                be created if s[1..i] ends inside (in-between) a non-leaf edge.

        RULE 3: If the path from the root labelled S[j..i] ends at non-leaf edge
                (i.e. there are more characters after S[i] on path) and next character
                is s[i+1] (already in tree), do nothing.
         */


        this.end.value++; // RULE 1
        this.remainingSuffixCount++;
        let foundStopCondition = false;
        const new_number = this.texts[input][phase];
        let prev_node: SuffixTreeNode|undefined;

        // Iterate until all suffixes are added or Rule 3 has been triggered
        while (this.remainingSuffixCount > 0 && !foundStopCondition){

            // APCFALZ (activeNode change for Active Length ZERO)
            // no walk down is needed here (as activeLength is ZERO), so the next character we look for is current character being processed.
            if (this.activeLength === 0) {
                this.activeEdge = new_number;
                this.activeEdgeIndex = phase;
            }

            // walk down the active node
            this.walkDown(input); // APCFWD

            // Check if there is an edge for the activeEdge
            let node_activeEdge = this.activeNode.children.get(this.activeEdge);
            if (node_activeEdge !== undefined) {

                let index_next_number = node_activeEdge.start + this.activeLength;
                if (this.texts[node_activeEdge.input][index_next_number] === new_number) {
                    // RULE 3, next char is already in the suffix tree
                    // When rule 3 applies in any phase i, then before we move on to next phase i+1,
                    // we increment activeLength by 1.

                    if (index_next_number === node_activeEdge.end.value-1) {
                        node_activeEdge.addInput(input);
                    }
                    if (!end) {
                        this.activeLength++; // APCFER3
                        foundStopCondition = true;
                    }

                    if (prev_node !== undefined) {
                        prev_node.suffixLink = this.activeNode;
                        prev_node = undefined;
                    }

                } else {
                    // RULE
                    let leaf_node = new SuffixTreeNode(phase,this.end, input);
                    let internal_node = new SuffixTreeNode(node_activeEdge.start, {value: index_next_number}, node_activeEdge.input);

                    if (prev_node !== undefined) {
                        prev_node.suffixLink = internal_node;
                    }
                    prev_node = internal_node;

                    internal_node.children.set(new_number, leaf_node);
                    node_activeEdge.start += this.activeLength;
                    internal_node.children.set(this.texts[node_activeEdge.input][node_activeEdge.start], node_activeEdge);
                    this.activeNode.children.set(this.activeEdge, internal_node);
                }

            } else {
                // RULE 2
                this.activeNode.children.set(this.activeEdge, new SuffixTreeNode(phase, this.end, input));
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
                    this.activeEdge = this.texts[input][this.activeEdgeIndex];

                } else if (this.activeNode !== this.root) { // APCFER2C2
                    assert(this.activeNode.suffixLink !== undefined); // Sanity check
                    this.activeNode = this.activeNode.suffixLink;
                }
            }
        }
    }

    private propagateInputs(node:SuffixTreeNode): number[] {
        for (const child of node.children.values()) {
            node.addInput(...this.propagateInputs(child));
        }
        return node.inputs;
    }


    /**
     *
     * @private
     */
    private build() {
        for (let input = 0; input < this.texts.length; input++) {
            //TODO: start from the suffix that is not in the tree
            this.resetBuildVariables(input);

            for (let phase = 0; phase <  this.texts[input].length; phase++) {
                this.extend(input, phase, phase === this.texts[input].length-1);
            }
        }

        this.propagateInputs(this.root);
    }

    /**
     *
     * @param input1
     * @param input2
     * @param node
     * @private
     */
    private longestCommonSubsequenceRecursive(input1: number, input2: number, node: SuffixTreeNode): number {
        if (node.inputs.includes(input1) && node.inputs.includes(input2)) {
            let a: number[] = Array.from(node.children.values())
                .map(node => this.longestCommonSubsequenceRecursive(input1, input2, node))

            if (a.length > 0) {
                return node.length()+Math.max(...a);
            } else {
                return node.length()-1;
            }
        }
        return 0;
    }

    /**
     *
     * @param input1
     * @param input2
     */
    public longestCommonSubstring(input1: number, input2: number): number {
        console.assert(input1 < this.texts.length && input2 < this.texts.length);
        return this.longestCommonSubsequenceRecursive(input1, input2, this.root);
    }

    private allLongestCommonSubstringsRecursive(node: SuffixTreeNode, depth:number, results: number[][]){
        depth += (node.children.size > 0 ? node.length() : node.length()-1);

        for (let i = 0; i < node.inputs.length; i++) {
            for (let j = i+1; j < node.inputs.length; j++) {
                const i_input = node.inputs[i];
                const j_input = node.inputs[j];
                if (results[i_input][j_input] < depth) {
                    results[i_input][j_input] = depth;
                    results[j_input][i_input] = depth;
                }
            }
        }

        for (const child of node.children.values()) {
            this.allLongestCommonSubstringsRecursive(child, depth, results);
        }
    }

    public allLongestCommonSubstrings(): number[][] {
        const results = Array.from({ length: this.texts.length }, () => Array(this.texts.length).fill(0));
        this.allLongestCommonSubstringsRecursive(this.root, 0, results);
        return results;
    }

    /**
     *
     * @param text
     */
    public hasSubstring(text: iType[]): boolean {

        let index = 0;
        let notInTree = false;
        let currentNode: SuffixTreeNode = this.root;

        while(index < text.length && !notInTree) {
            if (currentNode.children.has(text[index])) {
                currentNode = currentNode.children.get(text[index])! // safe because checked in if;
                let length = currentNode.end.value - currentNode.start;

                const edgeString = this.texts[currentNode.input].slice(currentNode.start, currentNode.end.value);
                const textString = text.slice(index, index+length)
                if (!arrayStartsWith(edgeString,textString)) {
                    notInTree = true;
                }

                index += length;
            } else {
                notInTree = true;
            }
        }
        return !notInTree;
    }

    /**
     *
     * @param text
     */
    public hasSuffix(text: iType[]): boolean {
        return this.hasSubstring(text.concat(["$"]));
    }

    /**
     *
     * @param node
     * @param depth
     * @private
     */
    private printRecursive(node: SuffixTreeNode, depth: number) {
        const spacing = "    ".repeat(depth);
        const start_stop = `(${node.start}, ${node.end.value})`
        const substring = this.texts[node.input].slice(node.start, node.end.value);
        const suffixlink = node.suffixLink !== undefined ? `-> ${node.suffixLink.id}` : ``;
        const inputs =  node.inputs.join(",")
        if (depth !== 0) {
            console.log(`${spacing}N-${node.id}  ${start_stop}: ${substring} ${suffixlink} [${inputs}]`);
        } else {
            console.log(`ROOT [${inputs}]`);
        }

        node.children.forEach(node => {this.printRecursive(node, depth + 1);});
    }

    /**
     *
     */
    public print() {
        this.printRecursive(this.root, 0);
    }

    /**
     *
     */
    public toObject() {
        return this.root.toObject();
    }
}