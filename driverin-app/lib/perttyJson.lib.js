function prettyJSONString(inputString) {
    return JSON.stringify(JSON.parse(inputString), null, 2);
}

module.exports = prettyJSONString;