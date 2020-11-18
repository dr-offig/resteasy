const fs = require('fs');
const jsd = require('jsondom');

let peel = (x) => {
  if (!Array.isArray(x) || x.length != 1 || !Array.isArray(x[0]))
    return x;
  else
    return peel(x[0]);
}

let flay = (x) => {
  if (!Array.isArray(x) || x.length != 1)
    return x;
  else
    return flay(x[0]);
}

let car = (lst) => {
  return lst[0];
}


let cdr = (lst) => {
  return (lst.slice(1));
}

let setNestedProperty = (obj, lstProps, value) => {
  if (lstProps.length == 1) {
    obj[car(lstProps)] = value;
  } else {
    setNestedProperty(obj[car(lstProps)], cdr(lstProps), value);
  }
}


let getNestedObject = (obj, lstProps) => {
  if (lstProps.length == 1) {
    return obj[car(lstProps)];
  } else {
    return getNestedObject(obj[car(lstProps)], cdr(lstProps));
  }
}


function getParentObject(root, lstProps) {
  lstProps.pop();
  return getNestedObject(root, lstProps);
}


let pathToKeyValuePair = (root, key, value) => {
  let matchingKeyPaths = jsd.getPathToKey(root, key);
  let firstMatch = matchingKeyPaths.filter(function(path) { return jsd.valueFromPath(root, path) === value; })[0].split('/');
  firstMatch.pop();
  return firstMatch;
}


let objectWithKeyValuePair = (root, key, value) => {
  return getNestedObject(root, pathToKeyValuePair(root, key, value))
}


let firstNestedObjectWithKey = (root, key) => {
  let matchingKeyPaths = jsd.getPathToKey(root, key);
  let firstMatchPath = matchingKeyPaths[0].split('/');
  return getNestedObject(root, firstMatchPath);
}


// for list of single-key-objects
let hoistListOfNamedObjectsInto = (lst, output) => {
  lst.forEach((item, i) => {
    let k = Object.keys(item)[0];
    output[k] = item[k];
  });
}

let hoistListOfNamedObjects = (lst) => {
  let output = {}
  lst.forEach((item, i) => {
    let k = Object.keys(item)[0];
    output[k] = item[k];
  });
  return output;
}


module.exports = {
  peel,
  flay,
  car,
  cdr,
  setNestedProperty,
  getNestedObject,
  getParentObject,
  pathToKeyValuePair,
  objectWithKeyValuePair,
  firstNestedObjectWithKey,
  hoistListOfNamedObjectsInto,
  hoistListOfNamedObjects
}
