var request = require('request');
var cheerio = require('cheerio');


module.exports = {
    vos: (msg) => {
        url = 'https://twitter.com/jagexclock';
        request(url, function(error, response, html){
            if(!error){
                var $ = cheerio.load(html);
                var firstVOS, secondVOS, vosChange;

                $('.js-tweet-text-container:contains("Voice of Seren is now active")').first().filter(function() {
                    var data = $(this);
                    
                    vosChange = `${60 - new Date().getMinutes()} minutes`;

                    if(data.text().indexOf('Amlodd') > 0){
                        if(data.text().indexOf('Amlodd') == '43'){ 
                            firstVOS = 'Amlodd';
                        } else {
                            secondVOS = 'Amlodd';
                        }
                    }
                    if(data.text().indexOf('Cadarn') > 0){
                        if(data.text().indexOf('Cadarn') == '43'){ 
                            firstVOS = 'Cadarn';
                        } else {
                            secondVOS = 'Cadarn';
                        }
                    }
                    if(data.text().indexOf('Crwys') > 0){
                        if(data.text().indexOf('Crwys') == '43'){ 
                            firstVOS = 'Crwys';
                        } else {
                            secondVOS = 'Crwys';
                        }
                    }
                    if(data.text().indexOf('Hefin') > 0){
                        if(data.text().indexOf('Hefin') == '43'){ 
                            firstVOS = 'Hefin';
                        } else {
                            secondVOS = 'Hefin';
                        }
                    }
                    if(data.text().indexOf('Iorwerth') > 0){
                        if(data.text().indexOf('Iorwerth') == '43'){ 
                            firstVOS = 'Iorwerth';
                        } else {
                            secondVOS = 'Iorwerth';
                        }
                    }
                    if(data.text().indexOf('Ithell') > 0){
                        if(data.text().indexOf('Ithell') == '43'){ 
                            firstVOS = 'Ithell';
                        } else {
                            secondVOS = 'Ithell';
                        }
                    }
                    if(data.text().indexOf('Meilyr') > 0){
                        if(data.text().indexOf('Meilyr') == '43'){ 
                            firstVOS = 'Meilyr';
                        } else {
                            secondVOS = 'Meilyr';
                        }
                    }
                    if(data.text().indexOf('Trahaearn') > 0){
                        if(data.text().indexOf('Trahaearn') == '43'){ 
                            firstVOS = 'Trahaearn';
                        } else {
                            secondVOS = 'Trahaearn';
                        }
                    } 

                    msg.channel.sendMessage("", {embed: {
                        color: 3447003,      
                        fields: [
                            {
                                name: 'Current VoS',
                                value: firstVOS + " and " + secondVOS,
                            },
                            {
                                name: 'Time Until VoS Change',
                                value: vosChange
                            }
                        ],
                    }});
                });
            }
        });
    },
    arax: (msg) => {
        const RaxPaths = [
            'Path 1 (Minions)',
            'Path 2 (Acid)',
            'Path 3 (Darkness)'
        ];

        var currentRotation = Math.floor((((Math.floor(Math.floor(Date.now() / 1000) / (24 * 60 * 60))) + 3) % (4 * RaxPaths.length)) / 4);
		var daysUntilRotation = 4 - ((Math.floor((Date.now() / 1000) / (24 * 60 * 60))) + 3) % (4 * RaxPaths.length) % 4;
		var nextClosedPath = currentRotation + 1;

		if (nextClosedPath === RaxPaths.length) nextClosedPath = 0; // Resets it back to the beginning

		var topPath = 'OPEN';
		var middlePath = 'OPEN';
		var bottomPath = 'OPEN';

		if (currentRotation == 0) { topPath = 'CLOSED'; }
		if (currentRotation == 1) { middlePath = 'CLOSED'; }
		if (currentRotation == 2) { bottomPath = 'CLOSED'; }

        msg.channel.sendMessage("", {embed: {
            color: 0x2eb82e,
            thumbnail: {
                url: 'https://vignette1.wikia.nocookie.net/runescape2/images/2/25/Araxxi.png/revision/latest/scale-to-width-down/251?cb=20140811033116'
            },
            title: 'Arraxor Path Rotation',
            fields: [
                {
                    name: 'Top Path (Minions)',
                    value: topPath
                },
                {
                    name: 'Middle Path (Acid)',
                    value: middlePath
                },
                {
                    name: 'Bottom Path (Darkness)',
                    value: bottomPath
                }
            ],
            footer: {
                icon_url: 'https://vignette1.wikia.nocookie.net/runescape2/images/2/25/Araxxi.png/revision/latest/scale-to-width-down/251?cb=20140811033116',
                text: `${RaxPaths[nextClosedPath]} will be closed in ${daysUntilRotation} ` + ((daysUntilRotation < 2) ? 'day' : 'days')
            }
        }});
    },
    gtime: (msg) => {
        var date = new Date();

        //Converting time into UTC hours and minutes. Inline if/else to add 0's to single digit hours and minutes.
        var hours = date.getUTCHours();
        var minutes = date.getUTCMinutes();

        //Sending rich embed message with current game time (UTC) to channel request command was sent.
        msg.channel.sendMessage("", {embed: {
            color: 3447003,      
            fields: [
                {
                    name: 'Current Game Time',
                    value: hours + ":" + ((minutes < 10) ? '0' + minutes : minutes),
                }
            ],
        }});
    },
    cache: (msg) => {
        var boostTime = '';
		var cacheTime = '';
        var cacheMessage = '';
        var date = new Date();

        
        var hoursUntilBoost = 2 - date.getUTCHours() % 3;
        var minutesUntilBoost = 59 - date.getUTCMinutes();

        var secondsUntil = 3600 - (date.getUTCMinutes()) % 60 * 60 - date.getUTCSeconds();
		var minutesUntil = Math.floor(secondsUntil / 60);


        if (minutesUntilBoost === 60) {
			hoursUntilBoost++;
			minutesUntilBoost = 0;
		}

		if (hoursUntilBoost > 0) {
			boostTime += `${hoursUntilBoost} hour${hoursUntilBoost > 1 ? 's' : ''}`;
		}

		if (hoursUntilBoost >= 1 && minutesUntilBoost > 1) {
			boostTime += ` and ${minutesUntilBoost} minute${minutesUntilBoost > 1 ? 's' : ''}`;
		}

		if (minutesUntilBoost > 1 && hoursUntilBoost < 1) {
			boostTime += `${minutesUntilBoost} minute${minutesUntilBoost > 0 && minutesUntilBoost < 2 ? '' : 's'}`;
		}

		/* CACHE TIME STR */
		if (minutesUntil === 0) {
			cacheTime += '1 hour';
		}

		if (minutesUntil > 0) {
			cacheTime += `${minutesUntil} minute${minutesUntil > 0 && minutesUntil < 1 ? '' : 's'}`;
		}

        if ((parseInt(cacheTime) == parseInt(boostTime)) && hoursUntilBoost == 0) {
            cacheTime += ' (Boost)';
            cacheMessage = `The next Guthixian Cache begins in **${cacheTime}**.`;
        } else {
            cacheMessage = `The next Guthixian Cache begins in **${cacheTime}**. The next Guthixian Cache with boost is in **${boostTime}**.`;
        }

         msg.channel.sendMessage("", {embed: {
            color: 0x42f4df,      
            fields: [
                {
                    name: 'Guthixian Cache',
                    value: cacheMessage,
                }
            ],
        }});
    },
    viswax: (msg) => {
        url = 'http://services.runescape.com/m=forum/forums.ws?75,76,387,65763383';
        request(url, function(error, response, html){
            if(!error){
                var $ = cheerio.load(html);

                var d = new Date();
                var visDay, firstSlot, secondSlot;

                $('.forum-post__body:contains("Combination for")').first().filter(function() {
                    var data = $(this);

                    visDay = parseInt(data.find('div').eq(0).text().match(/[0-9]+/)[0]);


                    if (visDay == d.getUTCDate()) {
                        
                        let runes = new RegExp(/Slot 1:.+?- (.+?)Slot 2:(.+?)Slot/).exec(data.text());
					    firstSlot = runes[1].trim().split(`-`).map(r => r.trim()).join(`\n`);
					    secondSlot = runes[2].trim().split(`-`).map(r => r.trim()).join(`\n`);

                        msg.channel.sendMessage("", {embed: {
                            color: 3447003,      
                            fields: [
                                {
                                    name: 'First Slot',
                                    value: firstSlot,
                                },
                                {
                                    name: 'Second Slot',
                                    value: secondSlot
                                }
                            ],
                        }});
                    } else {
                        msg.channel.sendMessage("The viswax runes for the current day have not been updated. Please check back shortly.");
                    }
                });
            }
        });
    },
    nemi: (msg) => {
        url = 'https://www.reddit.com/r/NemiForest/';
        request(url, function(error, response, html){
            if(!error){
                var $ = cheerio.load(html);
               
                var worldInfo, nemiPic;

                 $('div[data-url*="https://i.redd.it"]').first().filter(function() {
                    var data = $(this);

                    worldInfo = data.find('.title').first().find('a').first().text();
                    nemiPic = data.attr('data-url');

                    msg.channel.sendMessage("", {embed: {
                        color: 0xA26993,
                        fields: [
                            {
                                name: 'Nemi World Info',
                                value: worldInfo,
                            }
                        ],
                        image: {
                            url: nemiPic,
                        },                        
                    }});
                });
            }
        });
    },
    pengs: (msg) => {
        url = 'http://2016.world60pengs.com/';
        request(url, function(error, response, html){
            if(!error){
                var $ = cheerio.load(html);
               
                var pengLocations = [],
                    pengType = [],
                    pengNotes = [];
                    

            
            }
        });
    }
}