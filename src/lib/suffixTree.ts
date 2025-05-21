import {SuffixTreeNode} from "./suffixTreeNode.js";
import {arrayStartsWith, assert, mergeMapsOfList, onlyPositiveNumbers} from "./utils.js";
import {PairArray} from "./PairArray.js";
import {BitSet} from "bitset";

export interface SuffixTreeOptions {
    minMaximalPairLength: number;
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

    private longestFragments?: PairArray<number>;
    private similarities?: PairArray<number>;

    // Variables needed during the building phase
    private end: { value: number } = { value: 0 };
    private remainingSuffixCount: number = 0;
    private activePos: ActivePosition = new ActivePosition(this.root, 0, 0, 0);

    private options: SuffixTreeOptions = {minMaximalPairLength: 1};

    constructor(sequence: number[][], options?: SuffixTreeOptions) {
        if (options) {
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
     * @param input The currently processed input
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
     */
    private propagateInputs(node:SuffixTreeNode): number[] {
        for (const child of node.children.values()) {
            node.addInput(...this.propagateInputs(child));
        }
        return node.inputs;
    }


    /**
     * Start building the suffix tree.
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
    ///////////////// Analyse /////////////////////
    ///////////////////////////////////////////////

    public getLenghtsLongestCommonSubstrings():  PairArray<number> {
        if (!this.longestFragments) {
            this.analyse();
        }
        assert(this.longestFragments !== undefined);
        return this.longestFragments;
    }

    public getSimilarities(): PairArray<number> {
        if (!this.similarities) {
            this.analyse();
        }
        assert(this.similarities !== undefined);
        return this.similarities;
    }

    public analyse(): [PairArray<number>, PairArray<number>] {
        this.longestFragments = new PairArray(this.seqs.length, 0);
        const overlapBitsets = new PairArray<[BitSet, BitSet]>(this.seqs.length, () => [new BitSet(), new BitSet()]);

        const process = (sp1: StartPosition, sp2: StartPosition, length: number) => {
            let i1 = sp1.input;
            let i2 = sp2.input;

            if (this.longestFragments!.at(i1, i2) < length) {
                this.longestFragments!.set(i1, i2, length);
            }

            let bitsets = overlapBitsets.at(i1,i2);
            bitsets[sp1.input < sp2.input ? 0 : 1].setRange(sp1.start,sp1.start + length-1,1);
            bitsets[sp1.input < sp2.input ? 1 : 0].setRange(sp2.start,sp2.start + length-1,1);
        }

        this.findMaximalPairs(this.root, 0, process);
        this.calculateSimilarities(overlapBitsets);

        return [this.longestFragments!, this.similarities!]
    }


    ///////////////////////////////////////////////
    //////////////// Maximal pairs ////////////////
    ///////////////////////////////////////////////


    private createLeafMaps(node: SuffixTreeNode, depth: number): Map<number, StartPosition[]>[] {
        let leafMaps: Map<number, StartPosition[]>[] = [];

        for (const input of node.inputs) {
            const startIndex = this.seqs[input].length - 1 - depth;
            let leftChar = startIndex === 0 ? -1 : this.seqs[input][startIndex - 1];

            let leftMap: Map<number, StartPosition[]> = new Map();
            leftMap.set(leftChar, [{start: startIndex, input: input}]);

            leafMaps.push(leftMap);
        }

        return leafMaps;
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
            for(const [startIndex, startPositions] of map) {
                if (startIndex !== k || startIndex === -1) { // Strings that start with the same sequence also are a pair but have the same left value
                    union.push(...startPositions);
                }
            }
        }
        return union;
    }

    /**
     * All of the positions of the first array are paired with the positions for the second array for te given length.
     */
    private processPairs(length: number, startPositions1: StartPosition[], startPositions2: StartPosition[], process: (sp1: StartPosition, sp2: StartPosition, length: number) => void) {
        for (let sp1 of startPositions1) {
            for (let sp2 of startPositions2) {
                if (sp1.input !== sp2.input) {
                    process(sp1, sp2, length);
                }
            }
        }
    }

    private generatePairs(depth: number, childrenMaps: Map<number, StartPosition[]>[], process: (sp1: StartPosition, sp2: StartPosition, length: number) => void) {
        for (const [i, map] of childrenMaps.entries()) {
            for (const [leftChar, startPositions] of map) {
                let union: StartPosition[] = this.unionValues(childrenMaps.slice(i+1, childrenMaps.length), leftChar);
                this.processPairs(depth, startPositions, union, process);
            }
        }
    }

    private findMaximalPairs(node: SuffixTreeNode, depth: number, process: (sp1: StartPosition, sp2: StartPosition, length: number) => void) {

        let maps: Map<number, StartPosition[]>[] = [];

        if (node.isLeaf()) {
            maps = this.createLeafMaps(node, depth);
        } else {
            // retrieve all the child maps
            for (const child of node.children.values()) {
                maps.push(this.findMaximalPairs(child, depth + child.textLength(), process));
            }
        }

        if (depth >= this.options.minMaximalPairLength) {
            this.generatePairs(depth, maps, process);
        }

        // create the map of the current node
        return mergeMapsOfList(maps);
    }

    ///////////////////////////////////////////////
    ///////////////// Similarity //////////////////
    ///////////////////////////////////////////////

    private calculateSimilarity(input1: number, input2: number, pairs: [BitSet, BitSet]): number {
        let total_overlap = pairs[0].cardinality() + pairs[1].cardinality()
        let total_length = this.seqs[input1].length + this.seqs[input2].length - 2;
        return total_overlap / total_length;
    }

    private calculateSimilarities(bits: PairArray<[BitSet, BitSet]>) {
        this.similarities = new PairArray(this.seqs.length, 0);

        for (let input1 = 0; input1 < this.seqs.length; input1++) {
            for (let input2 = input1+1; input2 < this.seqs.length; input2++) {
                this.similarities.set(input1, input2, this.calculateSimilarity(input1, input2, bits.at(input1, input2)));
            }
        }
    }


    ///////////////////////////////////////////////
    /////////////////// SEARCH ////////////////////
    ///////////////////////////////////////////////

    /**
     * Checks if the suffix tree contains a given substring.
     * @param sequence The substring to search for.
     */
    public hasSubstring(sequence: number[]): boolean {

        let index = 0;
        let notInTree = false;
        let currentNode: SuffixTreeNode | undefined = this.root;

        while(index < sequence.length && !notInTree) {

            currentNode = currentNode?.children.get(sequence[index]);

            if (currentNode !== undefined) {
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
     * Check if a suffix is present in the suffix tree.
     * @param sequence The suffix to search for.
     */
    public hasSuffix(sequence: number[]): boolean {
        return this.hasSubstring(sequence.concat([0]));
    }


    ///////////////////////////////////////////////
    //////////////////// PRINT ////////////////////
    ///////////////////////////////////////////////


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