const google = require('google');

module.exports = {
    result: (msg) => {
        var gSearch = msg.content.substr(msg.content.indexOf(' ')+1);

		google(gSearch, (err, res) => {
			if (err) console.error(err);

			for (var i = 0; i < res.links.length; ++i) {
				var link = res.links[i];
				if(link.href != null){
					msg.channel.sendMessage(link.href);
					break;
				}
			}
		});
    }
}