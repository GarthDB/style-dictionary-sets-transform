import { default as jsonSetsFormatter } from "./json-sets-formatter";
import { colorRegex, dimensionRegex, sortObject } from "./helper-functions.js";

/**
 * The initial object to be used as the base for the JSON output
 * @type {object} initial
 */
const initial = {
  system: "Spectrum",
  version: "0.0.0-development",
  KEYS: {
    DIMENSION_LAYOUT_TOKENS: "layoutTokens",
    DIMENSION_COMPONENT_LAYOUT_TOKENS: "componentLayoutTokens",
    COLOR_THEMES: "colorThemes",
    COLOR_TOKENS: "colorTokens",
    COLOR_ALIASES: "colorAliases",
    COLOR_SEMANTICS: "colorSemantics",
    DIMENSIONS: "dimensions",
  },
  colorThemes: {
    light: {},
    dark: {},
    darkest: {},
  },
  dimensions: {},
};

/**
 * Extract the value for a token for the given set name
 * @param {object} token
 * @param {string} setName
 * @returns {string|undefined}
 */
const getFlatValue = (token, setName) => {
  /* If the object has a value property, return it */
  if (token.hasOwnProperty("value")) {
    return token.value;
  }

  /* If there's no sets property, return nothing */
  if (!token.hasOwnProperty("sets")) return;

  /* Check for the provided set name if a sets object exists */
  if (token.sets.hasOwnProperty(setName)) {
    return getFlatValue(token.sets[setName], setName);
  }

  if (token.sets.hasOwnProperty("spectrum")) {
    return getFlatValue(token.sets.spectrum, setName);
  }
};

/**
 * @type {import('style-dictionary/types').FormatFn} format
 */
const format = ({ dictionary, platform, file, options }) => {
  const result = JSON.parse(JSON.stringify(initial));

  // Fetch the themes from that initialized object
  const colorThemes = Object.keys(result.colorThemes);
  const jsonSets = JSON.parse(
    jsonSetsFormatter.format({ dictionary, platform, file, options })
  );

  Object.keys(jsonSets).forEach((tokenName) => {
    const newName = platform.prefix ? `${platform.prefix}-${tokenName}` : tokenName;
    const tokenValue = jsonSets[tokenName];

    if (tokenValue.hasOwnProperty("value")) {
      if (colorRegex.test(tokenValue.value)) {
        colorThemes.forEach((set) => {
          result.colorThemes[set][newName] = tokenValue.value;
        });
      } else if(dimensionRegex.test(tokenValue.value)) {
        result.dimensions[newName] = tokenValue.value;
      }
    } else {
      colorThemes.forEach((set) => {
        const value = getFlatValue(tokenValue, set);
        if (value) result.colorThemes[set][newName] = value;
      });

      const desktopValue = getFlatValue(tokenValue, "desktop");
      if (desktopValue) result.dimensions[newName] = desktopValue;
    }
  });

  // Sort all the color theme objects
  for (const theme in result.colorThemes) {
    result.colorThemes[theme] = sortObject(result.colorThemes[theme]);
  }

  result.dimensions = sortObject(result.dimensions, {
    description: "A scale stop of a given size",
    "scale-factor": "1",
  });

  return JSON.stringify(result, null, 2);
};

format.nested = true;

export default {
  name: "drover/json/sets",
  format,
};
