const timerBarLib = require("./lib/timerbars");

function formatTime(time) {
    return (Math.floor(time / 60) < 10 ? "0" : "") + Math.floor(time / 60) + ":" + (time % 60 < 10 ? "0" : "") + time % 60;
}

// create timer bars
let time = new timerBarLib.TimerBar("TIME LEFT", false);
time.visible = true;

let playerLevel = new timerBarLib.TimerBar("YOUR LEVEL", false);
playerLevel.visible = true;

let thirdPlace = new timerBarLib.TimerBar("3rd Player", false);
thirdPlace.textColor = 107;
thirdPlace.usePlayerStyle = true;
thirdPlace.visible = true;

let secondPlace = new timerBarLib.TimerBar("2nd Player", false);
secondPlace.textColor = 108;
secondPlace.usePlayerStyle = true;
secondPlace.visible = true;

let firstPlace = new timerBarLib.TimerBar("1st Player", false);
firstPlace.textColor = 109;
firstPlace.usePlayerStyle = true;
firstPlace.visible = true;

mp.events.add("updateTimerBars", () => {
    // sort players
    let players = mp.players.toArray().filter(p => p.hasVariable("weaponLevel"));
    players.sort((a, b) => b.getVariable("weaponLevel") - a.getVariable("weaponLevel"));
    players = players.slice(0, 3);

    // update player level
    playerLevel.text = ((mp.players.local.getVariable("weaponLevel") || 0) + 1).toString();

    // update first place
    firstPlace.title = `1st: ${players[0] ? players[0].name : "No one"}`;
    firstPlace.text = `${players[0] ? players[0].getVariable("weaponLevel") + 1 : ""}`;

    // update second place
    secondPlace.title = `2nd: ${players[1] ? players[1].name : "No one"}`;
    secondPlace.text = `${players[1] ? players[1].getVariable("weaponLevel") + 1 : ""}`;

    // update third place
    thirdPlace.title = `3rd: ${players[2] ? players[2].name : "No one"}`;
    thirdPlace.text = `${players[2] ? players[2].getVariable("weaponLevel") + 1 : ""}`;
});

mp.events.add("updateGameTime", (seconds) => {
    time.text = (seconds <= 10 ? "~r~" : "~s~") + formatTime(seconds);
});

mp.events.addDataHandler("weaponLevel", (entity, value) => {
    if (entity.type === "player") mp.events.call("updateTimerBars");
});