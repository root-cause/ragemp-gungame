let textTimer = null;
let areaData = null;

function getRandomXY(radius) {
    let a = Math.random() * 2 * Math.PI;
    let r = radius * Math.sqrt(Math.random());

    return {
        x: r * Math.cos(a),
        y: r * Math.sin(a)
    };
}

mp.events.add("playerDeath", (player, reason, killer) => {
    mp.game.audio.playSoundFrontend(-1, "Bed", "WastedSounds", true);
    mp.game.graphics.startScreenEffect("DeathFailMPIn", 0, true);
    mp.game.cam.setCamEffect(1);

    if (textTimer) clearTimeout(textTimer);
    textTimer = setTimeout(() => {
        mp.game.ui.messages.showShard("~r~Wasted", (killer ? `${killer.handle === player.handle ? `You committed suicide.` : `<C>${killer.name}</C> killed you.`}` : "You died."));
    }, 750);
});

mp.events.add("playerSpawn", () => {
    mp.game.graphics.stopScreenEffect("DeathFailMPIn");
    mp.game.cam.setCamEffect(0);

    if (textTimer) {
        clearTimeout(textTimer);
        textTimer = null;
    }
});

mp.events.add("setGameArea", (json) => {
    areaData = JSON.parse(json);
});

mp.events.add("makeSpawn", () => {
    let offset = getRandomXY(areaData.radius * 0.8);
    let position = mp.game.pathfind.getSafeCoordForPed(areaData.x + offset.x, areaData.y + offset.y, areaData.z, false, new mp.Vector3(), 16);
    mp.events.callRemote("spawnPlayerAt", JSON.stringify(position));
});