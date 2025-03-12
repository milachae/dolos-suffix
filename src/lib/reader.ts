import {readFileSync, readdirSync} from "fs";

/**
 * Read every files from the given directory.
 * @param dir A directory with files.
 * @return A tuple (files, content), The first element contains filenames and the second element is the content of all the files as strings.
 */
export function readDir(dir: string): [string[], string[]] {
    let files = readdirSync(dir);
    let content = readFiles(files.map((file: string) => `${dir}/${file}`));
    return [files, content];
}

/**
 * Read the content of all the given files.
 * @param locations An array of all the files you want to read.
 * @return The content of all the files as a string array.
 */
export function readFiles(locations: Array<string>): string[] {
    return locations.map(location => readPath(location));
}

/**
 * Read the content of a file.
 * @param location The location of the file.
 * @return The content of the file as a string.
 */
export function readPath(location: string): string {
    return readFileSync(location).toString();
}
