const statNames = ["SP0_STAMINA", "SP0_STRENGTH", "SP0_LUNG_CAPACITY", "SP0_WHEELIE_ABILITY", "SP0_FLYING_ABILITY", "SP0_SHOOTING_ABILITY", "SP0_STEALTH_ABILITY"];

mp.events.add("playerSpawn", () => {
    mp.game.player.setHealthRechargeMultiplier(0.0);
    for (let stat of statNames) mp.game.stats.statSetInt(mp.game.joaat(stat), 100, false);
});