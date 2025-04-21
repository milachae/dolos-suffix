import test from "ava";
import {PairArray} from "../lib/PairArray.js";

test("Should create a PairArray", t=> {
    const map = new PairArray<number>(10, 0);
    t.pass()
})

test("Should add a new pair to a PairArray and contain it", t => {
    const map = new PairArray<string>(5, "");
    map.set(0, 2, "foo");

    t.is(map.at(0, 2), "foo");
})

test("Should also contain the reversed pair", t => {
    const map = new PairArray<string>(3, "");
    map.set(0, 2, "foo");

    t.is(map.at(0,2), "foo");
    t.is(map.at(2,0), "foo");
})

test("Should be able to fill the full array", t => {
    const map = new PairArray<number>(4, () => 0);

    map.set(0, 1, 1);
    map.set(0, 2, 2);
    map.set(0, 3, 3);
    map.set(1, 2, 4);
    map.set(1, 3, 5);
    map.set(2, 3, 6);

    t.is(map.length, 6);
    t.is(map.at(0, 1), 1);
    t.is(map.at(0, 2), 2);
    t.is(map.at(0, 3), 3);
    t.is(map.at(1, 2), 4);
    t.is(map.at(1, 3), 5);
    t.is(map.at(2, 3), 6);
})

test("Should be able to save lists", t => {
    const map = new PairArray<number[]>(4, () => []);

    map.at(0, 1).push(0);

    t.is(map.at(0, 1).length, 1);
    t.is(map.at(0, 2).length, 0);
})

