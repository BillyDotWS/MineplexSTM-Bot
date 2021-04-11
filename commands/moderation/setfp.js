const { MessageEmbed } = require("discord.js")
const { prefix, errorColor } = require('../../config.json')
module.exports = {
    config: {
        name: "setfp",
        aliases: ['setforum', 'setforumposts'],
        description: "Sets the forum posts for a user",
        usage: "",
        category: "moderation",
        accessableby: "Mods"
    },
    run: async (bot, message, args) => {
        message.delete();
        // Check for User
        let invalidMsg = new MessageEmbed()
            .setTitle('Invalid Usage')
            .setDescription(`Missing or Invalid User`)
            .addField(`Usage:`, `\`${prefix}setfp <user> <number>\``)
            .setColor(errorColor)
        const target = message.mentions.members.first() || message.guild.members.cache.find(m => m.user.username === args[0]) || message.guild.members.cache.get(args[0])
        if (!target) return message.channel.send(invalidMsg)

        invalidMsg.setDescription('Invalid or Missing Number of Forum Posts')
        if (!args[1] || isNaN(args[1]) || args[1] < 0) return message.channel.send(invalidMsg)

        invalidMsg.setDescription('User does not have a database entry. Please assign them the Trainee Role again.')
        // Check to see if user has DB entry
        const menteeRef = dbmentees.doc(target.id)
        await menteeRef.get().then(async (doc) => {
            if (!doc.exists) { return message.channel.send(invalidMsg) }
        })

        await save.collection('mentees').doc(target.id).update({
            regularfp: args[1]
        })

        message.channel.send(new MessageEmbed().setTitle('Succesfully Modified Forum Posts').setDescription(`<@${target.id}>'s Forum Posts have been set to \`${args[1]}.\``).setColor('#00FFFF'))
    }
}