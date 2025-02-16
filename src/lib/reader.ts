import {readFileSync, readdirSync} from "fs";

export function readDir(dir: string): string[] {
    return readFiles(readdirSync(dir).map((file: string) => `${dir}/${file}`));
}

export function readFiles(locations: Array<string>): string[] {
    return locations.map(location => readPath(location));
}

export function readPath(location: string): string {
    return readFileSync(location).toString();
}
