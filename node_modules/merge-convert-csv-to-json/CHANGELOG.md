# Changelog

## v1.1.0

#### :rocket: Added Features

- Added options to convert transform string values into map using a pluginType named `transformPropertyToMap`

#### :fire: Removed
- Removed files `mergeUsers.js` and `mergeGroups.js` which was being unused


## v1.0.1

#### :bug: Bug Fixes

- Removed the code which was trying to read a file which didn't existed, a junk which creeped during the development cycle.

## v1.0.0

#### :rocket: Features

- Merge all the `CSV` files and convert into single `JSON` file.
- Merge all the `CSV` files, convert it to `JSON` object, assign it to a `JSON field` an then store it in a `JSON` file.
- Merge all the `CSV` files, convert it to `JSON` with every object *keyedBy* a `JSON` field and then store it to a `JSON` file.
- Merge all the `CSV` files, convert it to `JSON` with every object *keyedBy* a `JSON` field, assign the object to a `JSON` field and then store it to a `JSON` file.
