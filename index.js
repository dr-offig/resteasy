const fetch = require("node-fetch");
const utils = require("./utils.js")

let APIspec = {
  "token" : undefined,
  "tokenName" : undefined,
  "baseUrl" : undefined,
  "myIdQuery" : undefined
}

let myID = undefined;

let get = (path, action=console.log, extraHeaders={}) => {
    if (APIspec.baseUrl === undefined) {
      console.log("You need to specify an API (and probably a token) using the loadSpec function.");
      return;
    }
    let headers = extraHeaders;
    headers[APIspec.tokenName] = APIspec.token;
    let options = {
      'method': 'GET',
      'headers': headers
    }

    let url = APIspec.baseUrl + path
    console.log(url)
    console.log(options);

  fetch(url, options)
    .then(res => res.json())
    .then(action);
}


let useAPI = (APIurl, tokenEnvVarName, tokenOptionString, myIdQuery) => {
  APIspec.token = eval(`process.env.${tokenEnvVarName}`);
  APIspec.tokenName = tokenOptionString;
  APIspec.baseUrl = APIurl;
  APIspec.myIdQuery = myIdQuery;
}


let loadSpec = (specFile) => {
  specData = JSON.parse(fs.readFileSync(specFile));
  useAPI(specData.baseUrl, specData.token, specData.tokenName, specData.myIdQuery);
}

let getMyId = () => {
  if (APIspec.myIdQuery === undefined) { console.log("You need to specify an API (and probably a token) using the loadSpec function."); return; }
  get(APIspec.myIdQuery, x => { myID = x["id"]; })
}

module.exports = {
  useAPI: useAPI,
  loadSpec: loadSpec,
  getMyId: getMyId,
  get: get
};
