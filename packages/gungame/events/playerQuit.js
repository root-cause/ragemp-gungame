mp.events.add("playerQuit", (player, exitType) => {
    console.info(`[${new Date().toLocaleString()}] [QUIT] ${player.name} disconnected. (Reason: ${exitType})`);

    if (player.respawnTimer) {
        clearTimeout(player.respawnTimer);
        player.respawnTimer = null;
    }

    mp.players.forEach(p => p.notify(`<C>${player.name}</C> left. (${exitType})`));
    mp.players.call("updateTimerBars");
});