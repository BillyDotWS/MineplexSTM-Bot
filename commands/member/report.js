const { MessageEmbed } = require("discord.js")
const { prefix, errorColor } = require('../../config.json')
const xReport = require('../../functions/report.js')
module.exports = {
    config: {
        name: "report",
        description: "Sends a Report Card Now!",
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

        xReport(bot)
    }
}