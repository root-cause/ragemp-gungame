let areaData = null;
let gameArea = null;
let areaBlip = -1;

let timeLeft = 0;
let timer = null;
let soundId = -1;

function stopTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }

    if (soundId !== -1) {
        mp.game.audio.stopSound(soundId);
        mp.game.audio.releaseSoundId(soundId);
        soundId = -1;
    }
}

mp.events.add("playerEnterColshape", (shape) => {
    if (shape === gameArea) {
        timeLeft = 10;
        stopTimer();
    }
});

mp.events.add("playerExitColshape", (shape) => {
    if (shape === gameArea) {
        timeLeft = 10;
        stopTimer();

        soundId = mp.game.invoke("0x430386FE9BF80B45"); // GET_SOUND_ID
        mp.game.audio.playSoundFrontend(soundId, "Out_of_Bounds", "MP_MISSION_COUNTDOWN_SOUNDSET", false);

        timer = setInterval(() => {
            timeLeft--;

            if (timeLeft >= 1) {
                mp.game.ui.messages.showMidsizedShard("Outside Game Area", `Return to the ~y~game area~s~, you have ${timeLeft} ${timeLeft > 1 ? "seconds" : "second"}.`, 6, false, false, 1100, false);
            } else {
                mp.players.local.setHealth(0);
                stopTimer();
            }
        }, 1000);

        mp.game.ui.messages.showMidsizedShard("Outside Game Area", `Return to the ~y~game area~s~, you have 10 seconds.`, 6, false, false, 1100, false);
    }
});

mp.events.add("playerDeath", () => {
    stopTimer();
});

mp.events.add("setGameArea", (json) => {
    areaData = JSON.parse(json);

    if (gameArea) gameArea.destroy();
    gameArea = mp.colshapes.newCircle(areaData.x, areaData.y, areaData.radius);

    if (areaBlip !== -1) mp.game.ui.removeBlip(areaBlip);
    areaBlip = mp.game.ui.addBlipForRadius(areaData.x, areaData.y, areaData.z, areaData.radius);
    mp.game.invoke("0xDF735600A4696DAF", areaBlip, 9); // SET_BLIP_SPRITE
    mp.game.invoke("0x03D7FB09E75D6B7E", areaBlip, 5); // SET_BLIP_COLOUR
    mp.game.invoke("0x45FF974EEE1C8734", areaBlip, 100); // SET_BLIP_ALPHA
});