const game = require("../classes/game");

mp.events.add("playerSpawn", (player) => {
    player.sendsSpawnPos = false;
    player.health = 100;
    player.removeAllWeapons();

    if (player.respawnTimer) {
        clearTimeout(player.respawnTimer);
        player.respawnTimer = null;
    }

    if (game.isRunning) player.giveWeapon(mp.joaat(game.weapons[player.data.weaponLevel].Weapon), 9999);
});