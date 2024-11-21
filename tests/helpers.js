import StyleDictionary from "style-dictionary";

import { join } from "path";
import process from "process";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import { emptyDir } from "fs-extra";

export const outputDir = join(process.cwd(), "tests/__output/");

export function clearOutput () {
  return emptyDir(outputDir);
};

export async function buildPlatforms (filename, config, task = "build") {
  const outputFilename = join(outputDir, filename);

  const sd = new StyleDictionary(config);

  if (task === "export") {
    return sd.getPlatformTokens("JSON", { cache: false }).then((result) => result?.tokens);
  }

  return sd.buildAllPlatforms({ cache: false }).then(() => {
    if (!existsSync(outputFilename)) return Promise.reject(new Error(`File ${outputFilename} was not created`));

    // Check if the output file was created
    const result = readFile(outputFilename, { encoding: "utf8" });
    if (!result) return Promise.reject(new Error(`File ${outputFilename} created an empty file`));
    return Promise.resolve(result);
  });
};
