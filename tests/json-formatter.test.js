import StyleDictionary from "style-dictionary";

import { JsonSetsFormatter, NameKebabTransfom, AttributeSetsTransform } from "../index";
import { buildPlatforms, outputDir, clearOutput } from "./helpers";

import { join } from "path";
import { readFile } from "fs/promises";

StyleDictionary.registerTransform(NameKebabTransfom);
StyleDictionary.registerTransform(AttributeSetsTransform);
StyleDictionary.registerFormat(JsonSetsFormatter);

const generateConfig = (filename) => {
  return {
    source: [`tests/fixtures/${filename}`],
    platforms: {
      JSON: {
        buildPath: outputDir,
        transforms: [AttributeSetsTransform.name, NameKebabTransfom.name],
        files: [
          {
            destination: filename,
            format: "json/sets",
            options: {
              showFileHeader: false,
              outputReferences: true,
            },
          },
        ],
      },
    },
  };
};

beforeAll(() => {
  return clearOutput();
});

afterAll(() => {
  return clearOutput();
});

test("basic data with sets keyword in path should provide basic values", async () => {
  const filename = "basic.json";

  return buildPlatforms(filename, generateConfig(filename), "export").then(async (result) => {
    const expected = await readFile(`./tests/expected/${filename}`, { encoding: "utf-8" }).then(JSON.parse);
    expect(result).toMatchObject(expected);
  });
});

test("basic data with nests sets keywords in path should provide multiple values to sets attribute", async () => {
  const filename = "nest-sets-no-refs.json";

  return buildPlatforms(filename, generateConfig(filename), "export").then(async (result) => {
    const expected = await readFile(`./tests/expected/${filename}`, { encoding: "utf-8" }).then(JSON.parse);
    expect(result).toMatchObject(expected);
  });
});

test("a ref pointing to a set should include all values", async () => {
  const filename = "set-in-ref.json";

  return buildPlatforms(filename, generateConfig(filename)).then(async (result) => {
    const expected = await readFile(`./tests/expected/${filename}`, { encoding: "utf8" }).then(JSON.parse);
    expect(expected).toMatchObject(JSON.parse(result));
  });
});

test("a ref that points to additional refs should resolve", async () => {
  const filename = "multi-ref.json";

  return buildPlatforms(filename, generateConfig(filename)).then(async (result) => {
    const expected = await readFile(`./tests/expected/${filename}`, { encoding: "utf8" }).then(JSON.parse);
    expect(expected).toMatchObject(JSON.parse(result));
  });
});

test("should handle multi nested reference values", async () => {
  const filename = "multi-depth.json";

  return buildPlatforms(filename, generateConfig(filename)).then(async (result) => {
    const expected = await readFile(`./tests/expected/${filename}`, { encoding: "utf8" }).then(JSON.parse);
    expect(expected).toMatchObject(JSON.parse(result));
  });
});

test("should handle multi nested values", async () => {
  const filename = "multi-nested.json";

  return buildPlatforms(filename, generateConfig(filename)).then(async (result) => {
    const expected = await readFile(`./tests/expected/${filename}`, { encoding: "utf8" }).then(JSON.parse);
    expect(expected).toMatchObject(JSON.parse(result));
  });
});

test("should keep included uuid", async () => {
  const filename = "uuid.json";

  return buildPlatforms(filename, generateConfig(filename)).then(async (result) => {
    const expected = await readFile(`./tests/expected/${filename}`, { encoding: "utf8" }).then(JSON.parse);
    expect(expected).toMatchObject(JSON.parse(result));
  });
});
