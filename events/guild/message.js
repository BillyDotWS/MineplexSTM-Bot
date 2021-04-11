const { prefix, errorColor } = require("../../config.json");
const checker = require('../../functions/checker.js')
module.exports = async (bot, message) => {
    if (message.author.bot || message.channel.type === "dm") return;

    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();
    checker(bot, message, args)
    if (!message.content.startsWith(prefix)) return;
    let commandfile = bot.commands.get(cmd) || bot.commands.get(bot.aliases.get(cmd))
    if (commandfile) commandfile.run(bot, message, args)

}