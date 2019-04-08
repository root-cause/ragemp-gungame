const fs = require("fs");
const path = require("path");

module.exports.loadFiles = function(...dirNames) {
    dirNames.forEach((dirName) => {
        const finalPath = path.join(__dirname, dirName);

        fs.readdir(finalPath, (err, files) => {
            if (err) {
                console.error(`[ERROR] Failed to read "${dirName}": ${err.message}`);
            } else {
                files.forEach((fileName) => {
                    try {
                        require(path.join(finalPath, fileName));
                        console.info(`Loaded file "${dirName}/${fileName}".`);
                    } catch (e) {
                        console.error(`[ERROR] Failed to load "${dirName}/${fileName}": ${e.message}`);
                    }
                });
            }
        });
    });
};

module.exports.clamp = function(value, min, max) {
    return value <= min ? min : value >= max ? max : value;
};

module.exports.isLoadoutItemInvalid = function(item) {
    return !item.hasOwnProperty("Weapon") || !item.hasOwnProperty("KillsForNext") || typeof item.Weapon !== "string" || item.Weapon.length < 1 || !Number.isInteger(item.KillsForNext) || item.KillsForNext < 1;
};

module.exports.isMapInvalid = function(map, fileName) {
    if (!map.hasOwnProperty("CenterOfMap")) {
        if (fileName) console.error(`Map file (${fileName}) does not have center of map.`);
        return true;
    }

    if (typeof map.CenterOfMap.x !== "number" || typeof map.CenterOfMap.y !== "number" || typeof map.CenterOfMap.z !== "number" || typeof map.CenterOfMap.radius !== "number") {
        if (fileName) console.error(`Map file (${fileName}) has invalid center of map.`);
        return true;
    }

    if (!map.hasOwnProperty("SpawnPoints") || !Array.isArray(map.SpawnPoints) || map.SpawnPoints.length < 1) {
        if (fileName) console.error(`Map file (${fileName}) doesn't have any spawn points.`);
        return true;
    }

    for (const pos of map.SpawnPoints) {
        if (typeof pos.x !== "number" || typeof pos.y !== "number" || typeof pos.z !== "number" || typeof pos.a !== "number") {
            if (fileName) console.error(`Map file (${fileName}) has invalid spawn points.`);
            return true;
        }
    }

    if (map.hasOwnProperty("Props")) {
        for (const prop of map.Props) {
            if (typeof prop.model !== "string") {
                if (fileName) console.error(`Map file (${fileName}) has invalid props. (Type 1)`);
                return true;
            } else if (!prop.hasOwnProperty("position") || typeof prop.position.x !== "number" || typeof prop.position.y !== "number" || typeof prop.position.z !== "number") {
                if (fileName) console.error(`Map file (${fileName}) has invalid props. (Type 2)`);
                return true;
            } else if (!prop.hasOwnProperty("rotation") || (typeof prop.rotation.x !== "number" || typeof prop.rotation.y !== "number" || typeof prop.rotation.z !== "number")) {
                if (fileName) console.error(`Map file (${fileName}) has invalid props. (Type 3)`);
                return true;
            }
        }
    }
};