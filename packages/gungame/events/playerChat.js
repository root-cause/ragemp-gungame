mp.events.add("playerChat", (player, message) => {
    const chatMessage = `${player.name}(${player.id}): ${message}`;

    mp.players.broadcast(chatMessage);
    console.log(`[${new Date().toLocaleString()}] [CHAT] ${chatMessage}`);
});