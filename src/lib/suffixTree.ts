import {SuffixTreeNode} from "./suffixTreeNode.js";
import {arrayStartsWith, assert, iType} from "./utils.js";

export interface MaximalPair {
    start1: number,
    start2: number,
    length: number,
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
     * Walk down the activeNode according to the activeLength
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

    private splitEdge() {

    }

    private addLeaf() {

    }

    private followSuffixLink() {

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

                    if (prev_node !== undefined) {
                        prev_node.suffixLink = this.activeNode;
                        prev_node = undefined;
                    }

                    if (!end) {
                        this.activeLength++; // APCFER3
                        foundStopCondition = true;
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

    /**
     * Propagate the inputs of all leaves bottom-up through the tree.
     * @param node
     * @private
     */
    private propagateInputs(node:SuffixTreeNode): number[] {
        for (const child of node.children.values()) {
            node.addInput(...this.propagateInputs(child));
        }
        return node.inputs;
    }


    /**
     * Start building the suffix tree.
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

            if (node.isLeaf()) {
                return node.length()-1;
            } else {
                return node.length()+Math.max(...(Array.from(node.children.values())
                    .map(node => this.longestCommonSubsequenceRecursive(input1, input2, node))));
            }
        }
        return 0;
    }

    /**
     * Calculate the longest common substring between 2 inputs.
     * @param input1 The index of the first input
     * @param input2 The index of the second input
     */
    public longestCommonSubstring(input1: number, input2: number): number {
        console.assert(input1 < this.texts.length && input2 < this.texts.length);
        return this.longestCommonSubsequenceRecursive(input1, input2, this.root);
    }


    private allLongestCommonSubstringsRecursive(node: SuffixTreeNode, depth:number, results: number[][]){
        depth += (node.isLeaf() ? node.length()-1 : node.length());

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

    /**
     * Calculate all the longest common substrings between all pairs of inputs.
     */
    public allLongestCommonSubstrings(): number[][] {
        const results = Array.from({ length: this.texts.length }, () => Array(this.texts.length).fill(0));
        this.allLongestCommonSubstringsRecursive(this.root, 0, results);
        return results;
    }

    private maximalPairsRecursive(node: SuffixTreeNode, depth: number, pairs: MaximalPair[]): Map<number, number[]> {

        let leftMap: Map<number, number[]> = new Map();

        if (node.isLeaf()) {
            let leftChar = node.start - depth === 0 ? -1 : this.texts[node.input][node.start - 1 - depth];
            assert(typeof leftChar === 'number');

            return leftMap.set(leftChar, [node.start - depth]);
        }

        let maps: Map<number, number[]>[] = [];

        // retrieve all the child maps
        for (const child of node.children.values()) {
            maps.push(this.maximalPairsRecursive(child, depth + node.length(), pairs));
        }

        // calculate the maximal pairs
        if (depth + node.length() > 0) {
            for (const [i, map] of maps.entries()) {
                for (const [left, startPositions] of map) {
                    let union: number[] = [];
                    for (const map1 of maps.slice(i, maps.length)) {
                        if (map !== map1) {
                            for(const [left1, startPositions1] of map1) {
                                if (left1 !== left ) {
                                    union.push(...startPositions1);
                                }
                            }
                        }
                    }
                    for (let option of startPositions) {
                        for (let option1 of union) {
                            pairs.push({start1: option, start2: option1, length: depth + node.length()});
                        }
                    }
                }
            }
        }


        // create the map of the current node
        for (let childMap of maps){
            for (let [key, value] of childMap) {
                leftMap.set(key, [...(leftMap.get(key) || []), ...value]);
            }
        }


        // calculate all pairs
        return leftMap;
    }

    /**
     *
     */
    public maximalPairs(): MaximalPair[] {
        let maximalPairs: MaximalPair[] = [];
        this.maximalPairsRecursive(this.root, 0, maximalPairs);
        return maximalPairs;
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
     * Convert the suffix tree to an object.
     */
    public toObject() {
        return this.root.toObject();
    }
}