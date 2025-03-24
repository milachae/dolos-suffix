import {SuffixTreeNode} from "./suffixTreeNode.js";
import {arrayStartsWith, assert, onlyPositiveNumbers} from "./utils.js";
import {TupleMap} from "./TupleMap.js";

export interface SuffixTreeOptions {
    minMaximalPairLength: number;
}

export interface MaximalPair {
    starts: [StartPosition, StartPosition],
    length: number,
}

export interface StartPosition {
    start: number,
    input: number
}


class ActivePosition {
    private readonly startNode: SuffixTreeNode;

    constructor(
        public node: SuffixTreeNode,
        public length: number,
        public edge: number,
        public edgeIndex: number
    ) {
        this.startNode = node;
    }

    public reset(activeEdge: number) {
        this.length = 0;
        this.edge = 0;
        this.node = this.startNode;
        this.edge = activeEdge;
        this.edgeIndex = 0;
    }

    public getActiveEdgeNode() {
        return this.node.children.get(this.edge);
    }
}

/**
 * A suffix tree that only accepts number greater or equal than 1.
 */
export class SuffixTree {

    public root: SuffixTreeNode = new SuffixTreeNode(0, {value: 0}, 0);

    private readonly seqs:number[][] = [];

    // Variables needed during the building phase
    private end: { value: number } = { value: 0 };
    private remainingSuffixCount: number = 0;
    private activePos: ActivePosition = new ActivePosition(this.root, 0, 0, 0);

    private options: SuffixTreeOptions = {minMaximalPairLength: 1};

    constructor(sequence: number[][], options?: SuffixTreeOptions) {
        if (options !== undefined) {
            this.options = options;
        }

        sequence.forEach((sequence) => {
            assert(onlyPositiveNumbers(sequence),"This suffix tree only accept strict positive numbers");
            this.seqs.push([...sequence, 0]);
        });
        this.root.suffixLink = this.root;
        this.resetBuildVariables(0);
        this.build();
    }

    ///////////////////////////////////////////////
    //////////////////// BUILD ////////////////////
    ///////////////////////////////////////////////

    private resetBuildVariables(i: number) {
        assert(i < this.seqs.length && i >= 0);
        this.end = {value: 0};
        this.activePos.reset(this.seqs[i][0]);
        this.remainingSuffixCount = 0;
    }

    /**
     * Walk down the activeNode according to the activeLength
     * @param input
     * @private
     */
    private walkDown(input: number) {
        let node_activeEdge = this.activePos.getActiveEdgeNode();

        while (node_activeEdge !== undefined && this.activePos.length >= node_activeEdge.length()) {
            this.activePos.node = node_activeEdge;
            this.activePos.edgeIndex += this.activePos.node.length();
            this.activePos.edge = this.seqs[input][this.activePos.edgeIndex];
            this.activePos.length -= this.activePos.node.length();
            node_activeEdge = this.activePos.getActiveEdgeNode();
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
        const new_number = this.seqs[input][phase];
        let prev_node: SuffixTreeNode|undefined;

        // Iterate until all suffixes are added or Rule 3 has been triggered
        while (this.remainingSuffixCount > 0 && !foundStopCondition){

            // APCFALZ (activeNode change for Active Length ZERO)
            // no walk down is needed here (as activeLength is ZERO), so the next character we look for is current character being processed.
            if (this.activePos.length === 0) {
                this.activePos.edge = new_number;
                this.activePos.edgeIndex = phase;
            }

            // walk down the active node
            this.walkDown(input); // APCFWD

            // Check if there is an edge for the activeEdge
            let node_activeEdge = this.activePos.getActiveEdgeNode();
            if (node_activeEdge !== undefined) {

                let index_next_number = node_activeEdge.start + this.activePos.length;
                if (this.seqs[node_activeEdge.input][index_next_number] === new_number) {
                    // RULE 3, next char is already in the suffix tree
                    // When rule 3 applies in any phase i, then before we move on to next phase i+1,
                    // we increment activeLength by 1.

                    if (index_next_number === node_activeEdge.end.value-1) {
                        node_activeEdge.addInput(input);
                    }

                    if (prev_node !== undefined) {
                        prev_node.suffixLink = this.activePos.node;
                        prev_node = undefined;
                    }

                    if (!end) {
                        this.activePos.length++; // APCFER3
                        foundStopCondition = true;
                    }

                } else {
                    // RULE (Split edge)
                    let leaf_node = new SuffixTreeNode(phase,this.end, input);
                    let internal_node = new SuffixTreeNode(node_activeEdge.start, {value: index_next_number}, node_activeEdge.input);

                    if (prev_node !== undefined) {
                        prev_node.suffixLink = internal_node;
                    }
                    prev_node = internal_node;

                    internal_node.children.set(new_number, leaf_node);
                    node_activeEdge.start += this.activePos.length;
                    internal_node.children.set(this.seqs[node_activeEdge.input][node_activeEdge.start], node_activeEdge);
                    this.activePos.node.children.set(this.activePos.edge, internal_node);
                }

            } else {
                // RULE 2
                this.activePos.node.children.set(this.activePos.edge, new SuffixTreeNode(phase, this.end, input));
                if (prev_node !== undefined) {
                    prev_node.suffixLink = this.activePos.node;
                    prev_node = undefined;
                }
            }

            if (!foundStopCondition) {
                // update activeNode
                this.remainingSuffixCount--; // leaf created

                if (this.activePos.node === this.root && this.activePos.length > 0) { // APCFER2C1
                    this.activePos.length--;
                    this.activePos.edgeIndex = phase - this.remainingSuffixCount + 1;
                    this.activePos.edge = this.seqs[input][this.activePos.edgeIndex];

                } else if (this.activePos.node !== this.root) { // APCFER2C2
                    assert(this.activePos.node.suffixLink !== undefined); // Sanity check
                    this.activePos.node = this.activePos.node.suffixLink;
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
        for (let input = 0; input < this.seqs.length; input++) {
            //TODO: start from the suffix that is not in the tree
            this.resetBuildVariables(input);

            for (let phase = 0; phase <  this.seqs[input].length; phase++) {
                this.extend(input, phase, phase === this.seqs[input].length-1);
            }
        }

        this.propagateInputs(this.root);
    }

    ///////////////////////////////////////////////
    ////////// Longest common substring ///////////
    ///////////////////////////////////////////////

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
        console.assert(input1 < this.seqs.length && input2 < this.seqs.length);
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
        const results = Array.from({ length: this.seqs.length }, () => Array(this.seqs.length).fill(0));
        this.allLongestCommonSubstringsRecursive(this.root, 0, results);
        return results;
    }


    ///////////////////////////////////////////////
    //////////////// Maximal pairs ////////////////
    ///////////////////////////////////////////////

    /**
     * All of the positions of the first array are paired with the positions for the second array for te given length.
     * @param length
     * @param startPositions1
     * @param startPositions2
     * @param pairs
     * @private
     */
    private addPairs(length: number, startPositions1: StartPosition[], startPositions2: StartPosition[], pairs:  TupleMap<number, MaximalPair[]>) {
        for (let sp1 of startPositions1) {
            for (let sp2 of startPositions2) {
                if (sp1.input !== sp2.input) {

                    let key: [number, number] = [sp1.input, sp2.input];
                    if (!pairs.get(key)) {
                        pairs.set(key, [])
                    }
                    pairs.get(key)?.push({starts: [sp1, sp2], length: length})
                }
            }
        }
    }

    /**
     * Calculate the union of all the values of the maps that are not equal to the given key.
     * @param arrayMaps
     * @param k
     * @private
     */
    private unionValues(arrayMaps: Map<number, StartPosition[]>[], k:number): StartPosition[] {
        let union = [];
        for (const map of arrayMaps) {
            for(const [key, value] of map) {
                if (key !== k || key === -1) { // Strings that start with the same sequence also are a pair but have the same left value
                    union.push(...value);
                }
            }
        }
        return union;
    }

    private maximalPairsRecursive(node: SuffixTreeNode, depth: number, pairs: TupleMap<number, MaximalPair[]>): Map<number, StartPosition[]> {

        let childrenMaps: Map<number, StartPosition[]>[] = [];
        const newDepth = depth + node.length() + (node.isLeaf() ? -1 : 0) // don't include the end character in the length of the match

        if (node.isLeaf()) {
            for (const input of node.inputs) {
                let leftMap: Map<number, StartPosition[]> = new Map();

                const startIndex = this.seqs[input].length - depth - node.length();
                let leftChar = startIndex === 0 ? -1 : this.seqs[input][startIndex - 1];
                leftMap.set(leftChar, [...(leftMap.get(leftChar) || []), {start: startIndex, input: input}]);

                childrenMaps.push(leftMap);
            }

        } else {
            // retrieve all the child maps
            for (const child of node.children.values()) {
                childrenMaps.push(this.maximalPairsRecursive(child, newDepth, pairs));
            }
        }

        // calculate the maximal pairs only for pairs with a length longer than the allowed minimum
        if (newDepth >= this.options.minMaximalPairLength) {
            for (const [i, map] of childrenMaps.entries()) {
                for (const [leftChar, startPositions] of map) {
                    let union: StartPosition[] = this.unionValues(childrenMaps.slice(i+1, childrenMaps.length), leftChar);
                    this.addPairs(newDepth, startPositions, union, pairs);
                }
            }
        }

        let leftMap: Map<number, StartPosition[]> = new Map();

        // create the map of the current node
        for (let childMap of childrenMaps){
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
    public maximalPairs():  TupleMap<number, MaximalPair[]> {
        let maximalPairs: TupleMap<number, MaximalPair[]> = new TupleMap();
        this.maximalPairsRecursive(this.root, 0, maximalPairs);
        return maximalPairs;
    }

    public similarities(): number[][] {
        let sim: number[][] = new Array(this.seqs.length).fill(new Array(this.seqs.length).fill(0));
        const pairs = this.maximalPairs()

        for (let input1 = 0; input1 < this.seqs.length; input1++) {
            for (let input2 = input1+1; input2 < this.seqs.length; input2++) {

                let overlap = 0;
                if (pairs.has([input1, input2])) {

                    for (const maximalPairs of pairs.get([input1, input2])!) {
                        overlap += maximalPairs.length
                    }
                }

                sim[input1][input2] = overlap / (this.seqs[input1].length + this.seqs[input2].length);
                sim[input2][input1] = overlap / (this.seqs[input1].length + this.seqs[input2].length);
            }
        }

        return sim;
    }


    ///////////////////////////////////////////////
    /////////////////// SEARCH ////////////////////
    ///////////////////////////////////////////////

    /**
     *
     * @param text
     * Checks if the suffix tree contains a given sequence.
     * @param sequence
     */
    public hasSubstring(sequence: number[]): boolean {

        let index = 0;
        let notInTree = false;
        let currentNode: SuffixTreeNode = this.root;

        while(index < sequence.length && !notInTree) {
            if (currentNode.children.has(sequence[index])) {
                currentNode = currentNode.children.get(sequence[index])! // safe because checked in if;
                let length = currentNode.end.value - currentNode.start;

                const edge = this.seqs[currentNode.input].slice(currentNode.start, currentNode.end.value);
                const seqSlice = sequence.slice(index, index+length)
                if (!arrayStartsWith(edge,seqSlice)) {
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
     * @param sequence
     */
    public hasSuffix(sequence: number[]): boolean {
        return this.hasSubstring(sequence.concat([0]));
    }


    ///////////////////////////////////////////////
    //////////////////// PRINT ////////////////////
    ///////////////////////////////////////////////

    /**
     *
     * @param node
     * @param depth
     * @private
     */
    private printRecursive(node: SuffixTreeNode, depth: number) {
        const spacing = "    ".repeat(depth);
        const start_stop = `(${node.start}, ${node.end.value})`
        const substring = this.seqs[node.input].slice(node.start, node.end.value);
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
     * Print the suffix tree
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