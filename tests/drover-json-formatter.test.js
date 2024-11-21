import StyleDictionary from "style-dictionary";

import { DroverJsonFormatter, NameKebabTransfom, AttributeSetsTransform } from "../index";
import { buildPlatforms, outputDir, clearOutput } from "./helpers";

StyleDictionary.registerTransform(NameKebabTransfom);
StyleDictionary.registerTransform(AttributeSetsTransform);
StyleDictionary.registerFormat(DroverJsonFormatter);

const generateConfig = (filename) => ({
  source: [`tests/fixtures/${filename}`],
  platforms: {
    drover: {
      buildPath: outputDir,
      transforms: [AttributeSetsTransform.name, NameKebabTransfom.name],
      files: [
        {
          destination: filename,
          format: DroverJsonFormatter.name,
          options: {
            showFileHeader: false,
            outputReferences: true,
          },
        },
      ],
    },
  },
});

beforeAll(() => {
  return clearOutput();
});

afterAll(() => {
  return clearOutput();
});

test("drover format supports prefix", async () => {
  const filename = "drover-prefix.json";

  const config = generateConfig(filename);
  config.platforms.drover.prefix = "aprefix";

  return buildPlatforms(filename, config).then((result) => {
    expect(JSON.parse(result)).toMatchSnapshot();
  });
});

test("drover format meets basic requirements", async () => {
  const filename = "drover.json";

  return buildPlatforms(filename, generateConfig(filename)).then((result) => {
    expect(JSON.parse(result)).toMatchSnapshot();
  });
});

test("drover multi level with repeating color themes", async () => {
  const filename = "drover-nested-color-sets.json";

  return buildPlatforms(filename, generateConfig(filename)).then((result) => {
    expect(JSON.parse(result)).toMatchSnapshot();
  });
});
