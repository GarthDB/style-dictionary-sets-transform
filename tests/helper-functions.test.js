import { isObject, isASet, generateNameArray, sortObject, colorRegex, dimensionRegex } from "../lib/helper-functions.js";

// isASet,
// sortObject,

test("isObject tests if something is an object", () => {
  expect(isObject({})).toBe(true);
});

test("isObject should return false with Array", () => {
  expect(isObject([])).toBe(false);
});

test("isObject should return false with null", () => {
  expect(isObject(null)).toBe(false);
});

test("", () => {
  expect(isASet({ sets: "ding" })).toBe(true);
});

test("generateNameArray should return array of name parts", () => {
  expect(
    generateNameArray({ path: ["part1", "part2", "part3"] }).join("-")
  ).toBe("part1-part2-part3");
});

test("generateNameArray should accept a prefix", () => {
  expect(
    generateNameArray({ path: ["part1", "part2", "part3"] }, "aprefix")
      .join("-")
  ).toBe("aprefix-part1-part2-part3");
});

test("generateNameArray should accept a prefix", () => {
  expect(
    generateNameArray(
        { path: ["part1", "part2", "part3", "sets", "mobile", "part4"] },
        "aprefix"
      )
      .join("-")
  ).toBe("aprefix-part1-part2-part3-part4");
});

test("sortObject should sort object by key values", () => {
  const fixture = { b: 1, z: 2, a: 3 };
  const expected = { a: 3, b: 1, z: 2 };
  expect(sortObject(fixture)).toMatchObject(expected);
});

test("colorRegex should match rgb values", () => {
  expect(colorRegex.test("rgb(0,0,0)")).toBe(true);
});

test("colorRegex should match rgba values", () => {
  expect(colorRegex.test("rgba(0, 0, 0, 1)")).toBe(true);
});

test("dimensionRegex should match dimension values", () => {
  expect(dimensionRegex.test("12px")).toBe(true);
});

test("dimensionRegex should fail invalid dimension values", () => {
  expect(dimensionRegex.test("ding")).toBe(false);
});
