const { MessageEmbed } = require("discord.js")
const { prefix, errorColor } = require('../../config.json')
const xQuestion = require('../../functions/question.js')
module.exports = {
    config: {
        name: "qotd",
        description: "Sends a QOTD now.",
        usage: "",
        category: "member",
        accessableby: "Members"
    },
    run: async (bot, message, args) => {
        message.delete()
        const noperms = new MessageEmbed()
            .setTitle('Insufficient Permission')
            .addField('Permissions Needed', '`ADMINISTRATOR`', true)
            .setColor(errorColor)

        if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send(noperms)

        xQuestion(bot)
    }
}