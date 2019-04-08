const fs = require("fs");
const path = require("path");
const util = require("../util");
const maps = [];

const files = fs.readdirSync(__dirname);
for (const file of files) {
    if (path.extname(file) !== ".json") continue;

    const filePath = path.join(__dirname, file);
    const fileData = fs.readFileSync(filePath);
    if (fileData.length < 1) {
        console.error(`Map file (${file}) is empty.`);
        continue;
    }

    let map = {};

    try {
        map = JSON.parse(fileData);
        map.name = path.basename(filePath, ".json");
    } catch (jsonErr) {
        console.error(`Map file (${file}) couldn't be parsed: ${jsonErr.message}`);
        continue;
    }

    if (!util.isMapInvalid(map, file)) {
        maps.push(map);
    }
}

module.exports = maps;