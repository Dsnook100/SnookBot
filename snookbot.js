const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require ('./settings.json');

const weather = require('./commands/weather.js');
const music = require('./commands/music.js');
const prune = require('./commands/prune.js');
const google = require('./commands/google.js');
const eightball = require('./commands/8ball.js');
const runescape = require('./commands/runescape.js');
const currency = require('./commands/currency.js');

//When bot is logged in and ready.
client.on('ready', () => {
	console.log('I\'m Online');
});

//client.on('', ''=>{});
//When bot leaves a server.
client.on('guildDelete', guild => {
	console.log(`I have left ${guild.name} at ${new Date()}`);
});

//When the bot joins a server.
client.on('guildCreate', guild => {
	console.log(`I have joined ${guild.name} at ${new Date()}`);
});

//Used for when a new member joins the discord server.
client.on('guildMemberAdd', member =>{
	const channel = member.guild.channels.find('name', 'general');
	if (!channel) return;
	const message = `Welcome ${member.user.username}! Thanks for joining ${guild.name}.`;
	channel.send(message);
});

//When a member leaves a discord server.
client.on('guildMemberRemove', member =>{
	const channel = member.guild.channels.find('name', 'general');
	if (!channel) return;
	const message = `${member.user.username} has left the server.`;
	channel.send(message);
});

//Client register message command
var prefix = ".";
//Array of all possibly permissions.
var permissions = [
	"CREATE_INSTANT_INVITE","KICK_MEMBERS","BAN_MEMBERS","ADMINISTRATOR","MANAGE_CHANNELS","MANAGE_GUILD","READ_MESSAGES","SEND_MESSAGES","SEND_TTS_MESSAGES","MANAGE_MESSAGES","EMBED_LINKS","ATTACH_FILES","READ_MESSAGE_HISTORY", "MENTION_EVERYONE","EXTERNAL_EMOJIS","CONNECT","SPEAK","MUTE_MEMBERS","DEAFEN_MEMBERS","MOVE_MEMBERS","USE_VAD","CHANGE_NICKNAME","MANAGE_NICKNAMES","MANAGE_ROLES_OR_PERMISSIONS"];


//All commands that are usable by the bot.

var commands = {
    setValue: function( props, value ) {
        while ( props.length ) this[ props.pop() ] = value;
    }
}

/*commands.setValue( [ "commands", "cmds", "cmd", "help"] , (msg) => {
	var cmds = Object.keys(commands);
	console.log(cmds);
	for(var i=0; i < cmds.length; i++){ 
		cmds[i] = "."+cmds[i];
	}

	//Removes the "command" command from the list.
	cmds.shift();

	msg.channel.sendMessage("", {embed: {
		color: 16715535,
		fields: [
			{
				name: 'List of commands:',
				value: cmds.join('\n')
			}
		],
	}});
});
*/

commands.setValue(["weather", "w"],  (msg) => { weather(msg); });
commands.setValue(["google", "goog", "g"] , (msg) => { google.result(msg); });
commands.setValue(["8ball"] , (msg) => { eightball.eightball(msg); });

commands.setValue(["play"], (msg) => { music.play(msg); });
commands.setValue(["pause"], (msg) => { music.pause(msg); });
commands.setValue(["resume"], (msg) => { music.resume(msg); });
commands.setValue(["joinvoice", "jv"], (msg) => { music.joinVoice(msg); });
commands.setValue(["prune", "del"], (msg) => { prune.amount(msg); });

commands.setValue(["register", "reg"], (msg) => { currency.register(msg); });
commands.setValue(["balance", "bal"], (msg) => { currency.balance(msg); });
commands.setValue(["coinflip", "cf"], (msg) => { currency.coinflip(msg); });
commands.setValue(["blackjack", "blkj"], (msg) => { currency.blackjack(msg); });
commands.setValue(["give", "pay"], (msg) => { currency.give(msg); });
//commands.setValue(["roll"], (msg) => { currency.roll(msg); });

client.on("message", msg => {
	if (!msg.content.startsWith(prefix)) return;
	if (msg.author.bot) return;
	if (commands.hasOwnProperty(msg.content.toLowerCase().slice(prefix.length).split(' ')[0])) 
	commands[msg.content.toLowerCase().slice(prefix.length).split(' ')[0]](msg);
	
});

client.login(settings.token);

process.on("unhandledRejection", err => {
  console.error("Uncaught Promise Error: \n" + err.stack);
});