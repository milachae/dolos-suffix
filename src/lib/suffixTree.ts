export class Node {

    public children: Node[] = [];
    public end: boolean = false;
    public suffixLink: Node | null = null;

    constructor(public name?: string) {

    }
}


export class SuffixTree {
    public root: Node|null = new Node();

    constructor(text: string) {

    }
}