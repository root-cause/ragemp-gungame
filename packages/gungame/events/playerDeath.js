const util = require("../util");
const game = require("../classes/game");
const config = require("../config");

mp.events.add("playerDeath", (player, reason, killer) => {
    if (player.respawnTimer) clearTimeout(player.respawnTimer);

    player.respawnTimer = setTimeout(() => {
        player.sendsSpawnPos = true;
        player.respawnTimer = null;
        player.call("makeSpawn");
    }, config.respawnTimeSeconds * 1000);

    if (game.isRunning) {
        if (killer && killer !== player && killer.data.weaponLevel !== undefined) {
            mp.players.forEach(p => p.notify(`<C>${killer.name}</C> killed <C>${player.name}</C>.`));
            if (config.healthOnKill > 0) killer.health = util.clamp(killer.health + config.healthOnKill, 0, 100);

            const killerWeapon = game.weapons[killer.data.weaponLevel];
            if (mp.joaat(killerWeapon.Weapon) === reason) {
                killer.killsWithWeapon++;

                if (killer.killsWithWeapon >= killerWeapon.KillsForNext) {
                    killer.data.weaponLevel++;
                    killer.killsWithWeapon = 0;

                    if (killer.data.weaponLevel >= game.weapons.length) {
                        game.stop();
                    } else {
                        const nextWeapon = game.weapons[killer.data.weaponLevel];
                        killer.removeAllWeapons();
                        killer.giveWeapon(mp.joaat(nextWeapon.Weapon), 9999);
                        killer.call("ShowWeaponPurchasedMessage", ["~s~New Weapon", nextWeapon.Name, nextWeapon.Weapon, 2000]);
                    }
                }
            }
        }
    }
});

mp.events.add("spawnPlayerAt", (player, position) => {
    if (player.sendsSpawnPos) player.spawn(JSON.parse(position));
});