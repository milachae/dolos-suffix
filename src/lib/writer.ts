import {PairArray} from "./PairArray.js";
import {createWriteStream, mkdir} from "node:fs";

export function writeSimilarities(files: string[], similarities: PairArray<number>, dirName: string) {
    mkdir(dirName, { recursive: true }, (err) => {
        if (err) throw err;
    });

    const fileName = `${dirName}/similarities.csv`;
    const out = createWriteStream(fileName);
    out.write(`file1,file2,similarity\n`);

    for (let input1 = 0; input1 < files.length; input1++) {
        for (let input2 = input1+1; input2 < files.length; input2++) {
            out.write(`${files[input1]},${files[input2]},${similarities.at(input1, input2)}\n`);
        }
    }
}