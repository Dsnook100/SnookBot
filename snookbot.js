const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require ('./settings.json');

const weather = require('./commands/weather.js');
const music = require('./commands/music.js');
const prune = require('./commands/prune.js');
const google = require('./commands/google.js');
const pick = require('./commands/pick.js');
const runescape = require('./commands/runescape.js');

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
	let guild = member.guild;
	guild.defaultChannel.sendMessage(`${member.user.username} has joined ${guild.name}`);
});

//When a member leaves a discord server.
client.on('guildMemberRemove', member =>{
	let guild = member.guild;
	guild.defaultChannel.sendMessage(`${member.user.username} has left ${guild.name}`);
});

//Client register message command
var prefix = ".";
//Array of all possibly permissions.
var permissions = [
	"CREATE_INSTANT_INVITE","KICK_MEMBERS","BAN_MEMBERS","ADMINISTRATOR","MANAGE_CHANNELS","MANAGE_GUILD","READ_MESSAGES","SEND_MESSAGES","SEND_TTS_MESSAGES","MANAGE_MESSAGES","EMBED_LINKS","ATTACH_FILES","READ_MESSAGE_HISTORY", "MENTION_EVERYONE","EXTERNAL_EMOJIS","CONNECT","SPEAK","MUTE_MEMBERS","DEAFEN_MEMBERS","MOVE_MEMBERS","USE_VAD","CHANGE_NICKNAME","MANAGE_NICKNAMES","MANAGE_ROLES_OR_PERMISSIONS"];


//All commands that are usable by the bot.
const commands = {
	'commands': (msg) => {
		var cmds = Object.keys(commands);
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
	},
	'weather': (msg) => {
		weather(msg);
	},
	'play': (msg) => {
		music.play(msg);
	},
	'pause': (msg) => {
		music.pause(msg);
	},
	'resume': (msg) => {
		music.resume(msg);
	},
	'skip': (msg) => {
		music.skip(msg);
	},
	'joinVoice': (msg) => {
		music.joinVoice(msg);
	},
	'prune': (msg) => {
		prune.amount(msg);
	},
	'google': (msg) => {
		google.result(msg);
	},
	'pick': (msg) => {
		pick.randomPick(msg);
	},
	'vos': (msg) => {
		runescape.vos(msg);
	},
	'arax': (msg) => {
		runescape.arax(msg);
	},
	'gtime': (msg) => {
		runescape.gtime(msg);
	},
	'cache': (msg) => {
		runescape.cache(msg);
	},
	'viswax': (msg) => {
		runescape.viswax(msg);
	},
	'nemi': (msg) => {
		runescape.nemi(msg);
	},
	'pengs': (msg) => {
		runescape.pengs(msg);
	}
};

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