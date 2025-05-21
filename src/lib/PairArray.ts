export class PairArray<T> {

    private readonly map: T[];
    public readonly width: number;
    public readonly length: number;

    constructor(width: number, initialValue: T | (() => T)) {
        this.width = width;
        const initializer = typeof initialValue === "function" ? initialValue as () => T : () => initialValue;
        this.length = ((width-1) * width) / 2;
        this.map = Array.from({ length: this.length }, initializer);
    }

    private findIndex(x1: number, x2: number): number {
        let row = Math.min(x1, x2);
        let col = Math.max(x1, x2);

        return row * (2*this.width - row - 1)/2 + col - row - 1;
    }

    at(x1: number, x2: number): T {
        return this.map[this.findIndex(x1, x2)];
    }

    set(x1: number, x2: number, value: T) {
        this.map[this.findIndex(x1, x2)] = value;
        return this;
    }
}
