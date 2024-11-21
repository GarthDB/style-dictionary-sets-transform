[![npm version](https://badge.fury.io/js/style-dictionary-sets.svg)](https://badge.fury.io/js/style-dictionary-sets)
![tests workflow](https://github.com/garthdb/style-dictionary-sets/actions/workflows/test.yml/badge.svg)

# Style Dictionary Sets

This is a collection of transforms and formatters for adding support for `sets` to [Style Dictionary](https://styledictionary.com).

## Installation

for yarn:

```shell
yarn add style-dictionary-sets
```

for npm:

```shell
npm install style-dictionary-sets
```

## Usage

### `attribute/sets` transform

In the `config.js` bring in the transform, register it to Style Dictionary and add it to the `transforms` array.

```js
import StyleDictionary from "style-dictionary";
import { AttributeSetsTransform } from "style-dictionary-sets";

StyleDictionary.registerTransform(AttributeSetsTransform);

export default {
  source: ["tokens/**/*.json"],
  platforms: {
    JSON: {
      buildPath: "dist/json/",
      transforms: ["attribute/sets"],
      files: ...
    },
  },
};

```

This will add the `sets` array property to the `attributes` object on [`DesignToken`](https://github.com/amzn/style-dictionary/blob/main/types/DesignToken.d.ts) if a token path contains the keyword `sets`. The value added to the `sets` array is the subsequent string in the `path` object.

#### Examples

A source like this ([`tests/fixtures/basic.json`](https://github.com/GarthDB/style-dictionary-sets/blob/main/tests/fixtures/basic.json)):

```json
{
  "component": {
    "size": {
      "sets": {
        "mobile": {
          "value": "15px"
        },
        "desktop": {
          "value": "12px"
        }
      }
    }
  }
}
```

will transform the tokens to provide the following data to subsequent transforms and formatters:

```js
{
  tokens: [
    {
      value: "15px",
      filePath: "tests/fixtures/basic.json",
      isSource: true,
      original: { value: "15px" },
      name: "component-size-sets-mobile",
      attributes: { sets: ["mobile"] },
      path: ["component", "size", "sets", "mobile"],
    },
    {
      value: "12px",
      filePath: "tests/fixtures/basic.json",
      isSource: true,
      original: { value: "12px" },
      name: "component-size-sets-desktop",
      attributes: { sets: ["desktop"] },
      path: ["component", "size", "sets", "desktop"],
    },
  ];
}
```

If you add multiple nested 'sets', it will add the subsequent strings in path order.

So this source data:

```json
{
  "component": {
    "size": {
      "sets": {
        "subSystemOne": {
          "sets": {
            "mobile": {
              "value": "15px"
            },
            "desktop": {
              "value": "12px"
            }
          }
        },
        "subSystemTwo": {
          "sets": {
            "mobile": {
              "value": "16px"
            },
            "desktop": {
              "value": "13px"
            }
          }
        }
      }
    }
  }
}
```

will add transform the tokens to have the `sets` attribute like this:

```js
{
  tokens: [
    {
      value: "15px",
      filePath: "tests/fixtures/nest-sets-no-refs.json",
      isSource: true,
      original: { value: "15px" },
      name: "component-size-sets-sub-system-one-sets-mobile",
      attributes: { sets: ["subSystemOne", "mobile"] },
      path: ["component", "size", "sets", "subSystemOne", "sets", "mobile"],
    },
    {
      value: "12px",
      filePath: "tests/fixtures/nest-sets-no-refs.json",
      isSource: true,
      original: { value: "12px" },
      name: "component-size-sets-sub-system-one-sets-desktop",
      attributes: { sets: ["subSystemOne", "desktop"] },
      path: ["component", "size", "sets", "subSystemOne", "sets", "desktop"],
    },
    {
      value: "16px",
      filePath: "tests/fixtures/nest-sets-no-refs.json",
      isSource: true,
      original: { value: "16px" },
      name: "component-size-sets-sub-system-two-sets-mobile",
      attributes: { sets: ["subSystemTwo", "mobile"] },
      path: ["component", "size", "sets", "subSystemTwo", "sets", "mobile"],
    },
    {
      value: "13px",
      filePath: "tests/fixtures/nest-sets-no-refs.json",
      isSource: true,
      original: { value: "13px" },
      name: "component-size-sets-sub-system-two-sets-desktop",
      attributes: { sets: ["subSystemTwo", "desktop"] },
      path: ["component", "size", "sets", "subSystemTwo", "sets", "desktop"],
    },
  ];
}
```

### `font/openType` transform

This utility converts font-weight values from standard [Open Type syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight#common_weight_name_mapping) into a CSS-safe format.

| Value | Common weight name |
| -- | -- |
| 100 | Thin (Hairline) |
| 200 | Extra Light (Ultra Light) |
| 300 | Light |
| 400 | Normal (Regular) |
| 500 | Medium |
| 600 | Semi Bold (Demi Bold) |
| 700 | Bold |
| 800 | Extra Bold (Ultra Bold) |
| 900 | Black (Heavy) |
| 950 | Extra Black (Ultra Black) |

In the `config.js` bring in the transform, register it to Style Dictionary and add it to the `transforms` array.

```js
const StyleDictionary = require("style-dictionary");
const CSSOpenTypeTransform = require("style-dictionary-sets").CSSOpenTypeTransform;

StyleDictionary.registerTransform(CSSOpenTypeTransform);

module.exports = {
  source: ["tokens/**/*.json"],
  platforms: {
    JSON: {
      buildPath: "dist/json/",
      transforms: [CSSOpenTypeTransform.name],
      files: ...
    },
  },
};
```

### `json/sets` formatter

Some of this functionality is still being updated and refined for specific uses.

### `css/sets` formatter

WIP
