const Discord = require('discord.js');
const ytdl = require('ytdl-core');

//Your current voice channel for the client to join.
var voiceChannel = {};
//Used for putting youtube links in different channel (bot-links)
var guildChannel = "";
//Channel to send message about current song playing
var textChannel = {};
//Queue list for songs. Object with guild id as key and array values for song links.
var playList = {};
var clientVoice = "";
var voiceID = '';

module.exports = {
    play: (msg) => {
        if (msg.member.voiceChannel) {
            guildChannel = msg.guild.channels.array();
            textChannel[msg.guild.id] = msg.channel;
            var link = msg.content.split(" ");
            link.splice(0, 1);
            link = link.join(" ");
            try {
                if (playList[msg.guild.id].length > 0) {
                    playList[msg.guild.id].push(link);
                    console.log(link);
                } else {
                    playList[msg.guild.id] = [link];
                }
            } catch (e) {
                playList[msg.guild.id] = [link];
            }

            try {
                console.log(link);
                ytdl.getInfo(link, function(err, info) {
                    if (err) {
                        return playList[msg.guild.id].pop();
                    }
                    const embed = new Discord.RichEmbed();
                    msg.channel.sendEmbed(
                        embed.addField('Song added', info.title).addField('Songs In Queue', playList[msg.guild.id].length),
                        { disableEveryone: true }
                    );
                });
            } catch (e) {
                return playList[msg.guild.id].pop();
            }

            msg.delete();
            for (var i = 0; i < guildChannel.length; i++) {
                if (guildChannel[i].name == "bot-links") {
                    guildChannel[i].sendMessage(link);
                }
            }

            if (playList[msg.guild.id].length == 1) {
                voiceChannel[msg.guild.id] = msg.member.voiceChannel;
            }

            if (playList[msg.guild.id].length == 1) {
                ytdl.getInfo(playList[msg.guild.id][0], (err, info) => {
                    voiceChannel[msg.guild.id].join().then(connnection => {
                        let stream = ytdl(playList[msg.guild.id][0], {audioonly: true});
                        const embed = new Discord.RichEmbed();
                        textChannel[msg.guild.id].sendEmbed(
                            embed.addField('Now Playing', info.title).addField('Songs In Queue', playList[msg.guild.id].length),
                            { disableEveryone: true }
                        );

                        voiceID = connnection.playStream(stream, {volume: 0.1}).on('end', () => {
                            playNextSong(msg, msg.guild.id);
                        });
                    });
                });
            }
        } else {
            msg.delete();
            if (!voiceChannel[msg.guild.id]) {
                return msg.reply(`Please be in a voice channel first!`);
            }
        }
    },
    pause: (msg) => {
        voiceID.pause();
    },
    resume: (msg) => {
        voiceID.resume();
    },
    skip: (msg) => {
        voiceID.end();
    },
    joinVoice: (msg) => {
        voiceChannel[msg.guild.id] = msg.member.voiceChannel;
        voiceChannel[msg.guild.id].join();
    }
}


playNextSong = (msg, guildID) => {
    if (playList[guildID].length > 0) {
        playList[guildID].shift();
    }

    if (playList[guildID].length == 0) {
        voiceChannel[guildID].leave();
        return false;
    }
    ytdl.getInfo(playList[guildID][0], (err, info) => {
        voiceChannel[guildID].join().then(connnection => {
            let stream = ytdl(playList[guildID][0], {audioonly: true});
            const embed = new Discord.RichEmbed();
            textChannel[guildID].sendEmbed(
                embed.addField('Now Playing', info.title).addField('Songs In Queue', playList[msg.guild.id].length - 1),
                { disableEveryone: true }
            );
            voiceID = connnection.playStream(stream, {volume: 0.1}).on('end', () => {
                playNextSong(msg, guildID);
            });
        });
    });
}