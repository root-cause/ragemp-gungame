mp.events.add("entityStreamIn", (entity) => {
    if (entity.type === "player") {
        if (entity.blip === 0) entity.createBlip(1);

        entity.setBlipColor(6);
        mp.game.invoke("0x234CDD44D996FD9A", entity.blip, 7); // SET_BLIP_CATEGORY
        mp.game.invoke("0x5FBCA48327B914DF", entity.blip, true); // SHOW_HEADING_INDICATOR_ON_BLIP
    }
});