module.exports = {
    randomPick: (msg) => {
        var pickArray = msg.content.substring(5 + 1).split(',');
		var randPick = pickArray[Math.floor(Math.random() * pickArray.length)];

		msg.channel.sendMessage(randPick);
    }
}