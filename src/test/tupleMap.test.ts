import test from "ava";
import {TupleMap} from "../lib/TupleMap.js";

test("Should create a TupleMap", t=> {
    const map = new TupleMap<number, string>();
    t.pass()
})

test("Should add a new tuple to a TupleMap and contain it", t => {
    const map = new TupleMap<number, string>();
    map.set([0,2], "foo");

    t.is(map.size, 1);
    t.is(map.get([0,2]), "foo");
    t.true(map.has([0,2]));
})

test("Should also contain the reversed tuple", t => {
    const map = new TupleMap<number, string>();
    map.set([0,2], "foo");

    t.is(map.get([2,0]), "foo");
    t.true(map.has([2,0]));
})

