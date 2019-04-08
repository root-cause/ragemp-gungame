let bigMessageScaleform = null;
let bigMsgInit = 0;
let bigMsgDuration = 5000;
let bigMsgAnimatedOut = false;

mp.events.add("ShowWeaponPurchasedMessage", (title, weaponName, weaponHash, time = 3000) => {
    if (bigMessageScaleform == null) bigMessageScaleform = new messageScaleform("mp_big_message_freemode");
    weaponHash = mp.game.joaat(weaponHash);

    bigMessageScaleform.callFunction("SHOW_WEAPON_PURCHASED", title, weaponName, weaponHash);

    switch (mp.game.weapon.getWeaponDamageType(weaponHash)) {
        case 2:
            mp.game.audio.playSoundFrontend(-1, "Next_Level_Melee", "DLC_Biker_KQ_Sounds", true);
        break;

        case 3:
            mp.game.audio.playSoundFrontend(-1, "Next_Level_Gun", "DLC_Biker_KQ_Sounds", true);
        break;

        case 5:
        case 6:
            mp.game.audio.playSoundFrontend(-1, "Next_Level_Explosive", "DLC_Biker_KQ_Sounds", true);
        break;

        default:
            mp.game.audio.playSoundFrontend(-1, "Next_Level_Generic", "DLC_Biker_KQ_Sounds", true);
        break;
    }

    bigMsgInit = Date.now();
    bigMsgDuration = time;
    bigMsgAnimatedOut = false;
});

mp.events.add("ShowPlaneMessage", (title, planeName, planeHash, time = 3000) => {
    if (bigMessageScaleform == null) bigMessageScaleform = new messageScaleform("mp_big_message_freemode");
    bigMessageScaleform.callFunction("SHOW_PLANE_MESSAGE", title, planeName, planeHash);

    bigMsgInit = Date.now();
    bigMsgDuration = time;
    bigMsgAnimatedOut = false;
});

mp.events.add("ShowShardMessage", (title, message, titleColor, bgColor, time = 3000) => {
    if (bigMessageScaleform == null) bigMessageScaleform = new messageScaleform("mp_big_message_freemode");
    bigMessageScaleform.callFunction("SHOW_SHARD_CENTERED_MP_MESSAGE", title, message, titleColor, bgColor);

    bigMsgInit = Date.now();
    bigMsgDuration = time;
    bigMsgAnimatedOut = false;
});

mp.events.add("render", () => {
    if (bigMessageScaleform != null) {
        bigMessageScaleform.renderFullscreen();

        if (bigMsgInit > 0 && Date.now() - bigMsgInit > bigMsgDuration) {
            if (!bigMsgAnimatedOut) {
                bigMessageScaleform.callFunction("TRANSITION_OUT");
                bigMsgAnimatedOut = true;
                bigMsgDuration += 750;
            } else {
                bigMsgInit = 0;
                bigMessageScaleform.dispose();
                bigMessageScaleform = null;
            }
        }
    }
});