setInterval(() => {
    mp.game.invoke("0x3EDCB0505123623B", mp.players.local.handle, true, mp.players.local.weapon >> 0); // SET_PED_INFINITE_AMMO
}, 1000);