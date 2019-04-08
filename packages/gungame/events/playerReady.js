const game = require("../classes/game");

mp.events.add("playerReady", (player) => {
    console.info(`[${new Date().toLocaleString()}] [JOIN] ${player.name} joined. (IP: ${player.ip})`);

    player.sendsSpawnPos = false;
    player.respawnTimer = null;
    player.killsWithWeapon = 0;
    player.data.weaponLevel = 0;

    player.model = "mp_m_freemode_01";
    player.setClothes(1, 57, 0, 2);
    player.setClothes(3, 41, 0, 2);
    player.setClothes(4, 98, 13, 2);
    player.setClothes(6, 71, 13, 2);
    player.setClothes(8, 15, 0, 2);
    player.setClothes(11, 251, 13, 2);

    const spawnPoint = game.map.SpawnPoints[ Math.floor(Math.random() * game.map.SpawnPoints.length) ];
    player.spawn(spawnPoint);
    player.heading = spawnPoint.a;

    player.call("setGameArea", [JSON.stringify(game.map.CenterOfMap)]);
    mp.players.forEach(p => p.notify(`<C>${player.name}</C> joined.`));
});