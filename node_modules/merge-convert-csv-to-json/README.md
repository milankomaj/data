[![Build Status](https://travis-ci.org/nishant-jain-94/merge-convert-csv-to-json.svg?branch=master)](https://travis-ci.org/nishant-jain-94/merge-convert-csv-to-json) [![Coverage Status](https://coveralls.io/repos/github/nishant-jain-94/merge-convert-csv-to-json/badge.svg?branch=master)](https://coveralls.io/github/nishant-jain-94/merge-convert-csv-to-json?branch=master)

# merge-convert-csv-to-json

Merges all the csv files and converts it to json.

## :rocket: Features

- Merge all the `CSV` files and convert into single `JSON` file.
- Merge all the `CSV` files, convert it to `JSON` object, assign it to a `JSON field` an then store it in a `JSON` file.
- Merge all the `CSV` files, convert it to `JSON` with every object *keyedBy* a `JSON` field and then store it to a `JSON` file.
- Merge all the `CSV` files, convert it to `JSON` with every object *keyedBy* a `JSON` field, assign the object to a `JSON` field and then store it to a `JSON` file.
- Merge all the `CSV` files, convert into single `JSON` file by converting string values into map by providing `keyValueSplitter`, `propertySplitter`, `keyIndex`, `valueIndex`, `field` and `pluginType` as `transfromPropertyToMap`

## Installation

#### Using NPM

```
npm install -g merge-convert-csv-to-json
```

#### Using YARN

```
yarn add merge-convert-csv-to-json
```

## Options

```
--pattern pattern         The pattern of the input files to process.
--keyBy propertyName      The name of the property to keyby.
--assignTo propertyName   The name of the property to assign the result to.
--outputTo filePath       The filepath to output the result to.
```

## Usage

- Merge all the `CSV` files and convert into single `JSON` file.
  ```
  merge-convert --pattern "/users/*.users.csv" --outputTo /users/merged.users.json
  ```
- Merge all the `CSV` files, convert it to `JSON` object, assign it to a `JSON field` and then store it in a `JSON` file.
  ```
  merge-convert --pattern "/users/*.users.csv" --assignTo users --outputTo /users/merged.users.json
  ```
- Merge all the `CSV` files, convert it to `JSON` with every object *keyedBy* a `JSON` field and then store it to a `JSON` file.
  ```
  merge-convert --pattern "/users/*.users.csv" --keyBy email --outputTo /users/merged.users.json
  ```
- Merge all the `CSV` files, convert it to `JSON` with every object *keyedBy* a `JSON` field, assign the object to a `JSON` field and then store it to a `JSON` file.
  ```
  merge-convert --pattern "/users/*.users.csv" --keyBy email --assignTo users --outputTo /users/merged.users.json
  ```
- Merge all the `CSV` files, convert into single `JSON` file by converting string values into map by providing `keyValueSplitter`, `propertySplitter`, `keyIndex`, `valueIndex`, `field` and `pluginType` as `transfromPropertyToMap`
  ```json
  # transformer-config.json
  [
    {
      pluginType: "transformPropertyToMap",
      keyValueSplitter: ":",
      propertySplitter: ",",
      keyIndex: "0",
      valueIndex: "1",
      field: "groups_access"
    },
    {
      pluginType: "transformPropertyToMap",
      keyValueSplitter: ":",
      propertySplitter: ",",
      keyIndex: "0",
      valueIndex: "1",
      field: "project_access"
    }
  ]
  ```

  ```
  merge-convert --pattern "/users/*.users.csv" --outputTo /users/merged.users.json --transformerConfig transformer-config.json
  ```
