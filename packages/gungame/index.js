const util = require("./util");
const game = require("./classes/game");
const config = require("./config");
const loadouts = require("./loadouts");
const maps = require("./maps");

function startGame() {
    game.secondsLeft = config.gameTimeSeconds;
    game.weapons = loadouts[ Math.floor(Math.random() * loadouts.length) ];
    game.map = maps[ Math.floor(Math.random() * maps.length) ];
    game.start();
}

// load events
util.loadFiles("events");

// game events
let gameTimer = null;

game.on("start", () => {
    if (gameTimer) {
        clearTimeout(gameTimer);
        gameTimer = null;
    }

    mp.players.call("setGameArea", [JSON.stringify(game.map.CenterOfMap)]);

    mp.players.forEach((p) => {
        p.killsWithWeapon = 0;
        p.data.weaponLevel = 0;

        const spawnPoint = game.map.SpawnPoints[ Math.floor(Math.random() * game.map.SpawnPoints.length) ];
        p.spawn(spawnPoint);
        p.heading = spawnPoint.a;
    });

    const finalWeapon = game.weapons[game.weapons.length - 1];
    mp.players.call("ShowMidsizedShardMessage", ["Game Started", `First player to get ${finalWeapon.KillsForNext} ${finalWeapon.Name} ${finalWeapon.KillsForNext === 1 ? "kill" : "kills"} wins!`, 2, false, false, 5000]);
});

game.on("end", () => {
    if (mp.players.length > 0) {
        let players = mp.players.toArray().filter(p => p.data.weaponLevel !== undefined);
        players.sort((a, b) => b.data.weaponLevel - a.data.weaponLevel);
        if (players.length > 0) mp.players.call("ShowMidsizedShardMessage", ["Game Over", `<C>${players[0].name}</C> won this round.`, 2, false, false]);

        mp.players.forEach(p => p.removeAllWeapons());
        mp.players.broadcast(`Next round will start in ${config.restartTimeSeconds} seconds.`);
    }

    if (gameTimer) clearTimeout(gameTimer);
    gameTimer = setTimeout(startGame, config.restartTimeSeconds * 1000);
});

startGame();