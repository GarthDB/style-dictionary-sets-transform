import StyleDictionary from "style-dictionary";

import { CSSSetsFormatter, NameKebabTransfom, AttributeSetsTransform, CSSOpenTypeTransform } from "../index";
import { buildPlatforms, outputDir, clearOutput } from "./helpers";

import { readFile } from "fs/promises";

StyleDictionary.registerTransform(NameKebabTransfom);
StyleDictionary.registerTransform(AttributeSetsTransform);
StyleDictionary.registerTransform(CSSOpenTypeTransform);
StyleDictionary.registerFormat(CSSSetsFormatter);

const generateConfig = (filename) => {
  return {
    source: [`tests/fixtures/${filename}.json`],
    platforms: {
      CSS: {
        buildPath: outputDir,
        transforms: [AttributeSetsTransform.name, NameKebabTransfom.name, CSSOpenTypeTransform.name],
        files: [
          {
            destination: `${filename}.css`,
            format: CSSSetsFormatter.name,
            filter: (token) => {
              return (
                typeof token.attributes === "object" &&
                !Array.isArray(token.attributes) &&
                token.attributes !== null &&
                "sets" in token.attributes &&
                token.attributes.sets.every((element) => {
                  return ["desktop", "spectrum", "dark"].includes(element);
                })
              );
            },
            options: {
              showFileHeader: false,
              outputReferences: true,
              sets: ["desktop", "spectrum", "dark"],
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

test("basic data with sets keyword in path should provide basic css", async () => {
  const filename = "basic";

  return buildPlatforms(`${filename}.css`, generateConfig(filename)).then(async (result) => {
    const expected = await readFile(`./tests/expected/${filename}.css`, { encoding: "utf8" });

    expect(result).toEqual(expected);
  });
});

test("should handle multi nested reference css", async () => {
  const filename = "multi-depth";

  return buildPlatforms(`${filename}.css`, generateConfig(filename)).then(async (result) => {
    const expected = await readFile(`./tests/expected/${filename}.css`, { encoding: "utf8" });

    expect(result).toEqual(expected);
  });
});

test("should work with nested sets", async () => {
  const filename = "nest-sets-no-refs";

  return buildPlatforms(`${filename}.css`, generateConfig(filename)).then(async (result) => {
    const expected = await readFile(`./tests/expected/${filename}.css`, { encoding: "utf8" });

    expect(result).toEqual(expected);
  });
});

test("tokens without sets should still have names", async () => {
  const filename = "multi-ref";

  const config = generateConfig(filename);

  /* filter out tokens with sets */
  config.platforms.CSS.files[0].filter = (token) => {
    return !("sets" in token.attributes) || token.attributes.sets.length === 0;
  };
  /* remove sets option */
  delete config.platforms.CSS.files[0].options.sets;

  return buildPlatforms(`${filename}.css`, config).then(async (result) => {
    const expected = await readFile(`./tests/expected/${filename}.css`, { encoding: "utf8" });

    expect(result).toEqual(expected);
  });
});

test("prefix option should be added to var name", async () => {
  const filename = "multi-depth";

  const config = generateConfig(filename);
  config.platforms.CSS.prefix = 'aprefix';

  return buildPlatforms(`${filename}.css`, config).then(async (result) => {
    const expected = await readFile(`./tests/expected/${filename}-prefix.css`, { encoding: "utf8" });

    expect(result).toEqual(expected);
  });
});

test("selector option should set rule selector", async () => {
  const filename = "multi-depth";

  const config = generateConfig(filename);
  config.platforms.CSS.files[0].options.selector = '.aselector';

  return buildPlatforms(`${filename}.css`, config).then(async (result) => {
    const expected = await readFile(`./tests/expected/${filename}-selector.css`, { encoding: "utf8" });

    expect(result).toEqual(expected);
  });
});
