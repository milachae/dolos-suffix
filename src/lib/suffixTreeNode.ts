let ID: number = 0;

/**
 *
 */
export class SuffixTreeNode {

    public children: Map<number, SuffixTreeNode> = new Map<number, SuffixTreeNode>();
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

    public textLength(): number {
        // Do not include the terminal character in the actual length
        return this.length() - (this.isLeaf() ? 1 : 0);
    }

    public length(): number {
        return this.end.value - this.start;
    }

    public isLeaf(): boolean {
        return this.children.size === 0;
    }

    public toObject(): {} {
        let children: { [key: string]: {} } = {};
        for (const [k, child] of this.children) {
            children[k] = child.toObject();
        }
        return {start: this.start, end: this.end.value, input: this.input, children: children};
    }

    public addInput(...inputs: number[]) {
        for (const input of inputs) {
            if (!this.inputs.includes(input)) {
                this.inputs.push(input);
            }
        }
    }

}
