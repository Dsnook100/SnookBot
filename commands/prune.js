module.exports = {
    amount: (msg) => {
        if(msg.member.hasPermission('MANAGE_MESSAGES')) {
            var amount = msg.content.split(" ");
            amount.splice(0, 1);
            amount = amount.join(" ");

            msg.channel.bulkDelete(parseInt(amount) + 1);
        } else if(!msg.member.hasPermission('MANAGE_MESSAGES')) {
            msg.reply(`You do not permission to delete messages.`);
        }
    }
}