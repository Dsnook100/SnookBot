const weather = require('weather-js');

module.exports = (msg) => {
    var wZip = msg.content.substring(8 + 1).split(' ');
    console.log(wZip);
    weather.find({search: wZip, degreeType: 'F'}, (err, result) => {
        if(err) {
            console.log(err);
            msg.channel.sendMessage(`**Please enter a real location.**`);
        } else {
            var jsonString = JSON.stringify(result, null, 2);
            var data = JSON.parse(jsonString);

            var location = data[0].location.name;
            var zipCode = data[0].location.zipcode;
            var currentTemp = data[0].current.temperature;
            var sky = data[0].current.skytext;
            var fDay = [data[0].forecast[1].shortday, data[0].forecast[2].shortday, data[0].forecast[3].shortday, data[0].forecast[4].shortday];
            var fLow = [data[0].forecast[1].low, data[0].forecast[2].low, data[0].forecast[3].low, data[0].forecast[4].low];
            var fHigh = [data[0].forecast[1].high, data[0].forecast[2].high, data[0].forecast[3].high, data[0].forecast[4].high];
            var fSky = [data[0].forecast[1].skytextday, data[0].forecast[2].skytextday, data[0].forecast[3].skytextday, data[0].forecast[4].skytextday];

            msg.channel.sendMessage("", {embed: {
                color: 3447003,
                
                title: 'Weather for ' + location,
                description: 'Current: ' + currentTemp + '°' + ' ' + sky,
                
                fields: [
                    {
                        name: 'Today',
                        value: 'High: ' + fHigh[0] + '\nLow: ' + fLow[0] + '\n' + fSky[0],
                        inline: true
                    },
                    {
                        name: fDay[1],
                        value: 'High: ' + fHigh[1] + '\nLow: ' + fLow[1] + '\n' + fSky[1],
                        inline: true
                    },
                    {
                        name: fDay[2],
                        value: 'High: ' + fHigh[2] + '\nLow: ' + fLow[2] + '\n' + fSky[2],
                        inline: true
                    },
                    {
                        name: fDay[3],
                        value: 'High: ' + fHigh[3] + '\nLow: ' + fLow[3] + '\n' + fSky[3],
                        inline: true
                    }
                ],
            }});
        }
    });
}