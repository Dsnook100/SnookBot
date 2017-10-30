const Discord = require('discord.js');
module.exports = {
    eightball: (msg) => {
        var question = msg.content.substr(msg.content.indexOf(' ')+1);

        var answerArray = ['It is certain','It is decidedly so', 'Without a doubt', 'Yes definitely', 'You may rely on it', 'As I see it, yes', 'Most likely', 'Outlook good', 'Fuck Yes', 'Signs point to yes', 'Reply hazy try again', 'Ask again later', 'Better not tell you now', 'Cannot predict now', 'Concentrate and ask again', 'Don\'t count on it', 'My reply is no', 'My sources say no', 'Outlook not so good', 'Very doubtful'];
		var randAnswer = answerArray[Math.floor(Math.random() * answerArray.length)];

        const embed = new Discord.RichEmbed()
            .setColor(11337728)
            .addField(':question: ' + question, ':8ball: ' + randAnswer)
         msg.channel.send({ embed });
    }
}