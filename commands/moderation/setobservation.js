const { MessageEmbed } = require("discord.js")
const { prefix, errorColor } = require('../../config.json')
module.exports = {
    config: {
        name: "setobservation",
        aliases: ['seto', 'setobserve'],
        description: "Sets the observation score for a user",
        usage: "",
        category: "moderation",
        accessableby: "Mods"
    },
    run: async (bot, message, args) => {
        message.delete();

        // Perm Check
        const noperms = new MessageEmbed()
            .setTitle('Insufficient Permission')
            .addField('Permissions Needed', '`ADMINISTRATOR`', true)
            .setColor(errorColor)

        if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send(noperms)

        // Check for User
        let invalidMsg = new MessageEmbed()
            .setTitle('Invalid Usage')
            .setDescription(`Missing or Invalid User`)
            .addField(`Usage:`, `\`${prefix}setobservation <user> <score> <feedback>\``)
            .setColor(errorColor)
        const target = message.mentions.members.first() || message.guild.members.cache.find(m => m.user.username === args[0]) || message.guild.members.cache.get(args[0])
        if (!target) return message.channel.send(invalidMsg)

        invalidMsg.setDescription('Invalid or Missing Score for Observation')
        if (!args[1] || isNaN(args[1]) || args[1] < 0) return message.channel.send(invalidMsg)

        invalidMsg.setDescription('Invalid or Missing Feedback')
        if (!args[2]) return message.channel.send(invalidMsg)
        const feedback = args.slice(2).join(' ')

        invalidMsg.setDescription('User does not have a database entry. Please assign them the Trainee Role again.')
        // Check to see if user has DB entry
        const menteeRef = dbmentees.doc(target.id)
        await menteeRef.get().then(async (doc) => {
            if (!doc.exists) { return message.channel.send(invalidMsg) }
        })

        await save.collection('mentees').doc(target.id).update({
            observation: args[1]
        })

        message.channel.send(new MessageEmbed().setTitle('Succesfully Modified Observation Score').setDescription(`<@${target.id}>'s Obvservation Score have been set to \`${args[1]}.\``).setColor('#00FFFF'))
        target.user.send(new MessageEmbed().setTitle('Observeration Feedback').setDescription(`Feedback from: ${message.author}:\n${feedback}`).setColor('#00FFFF'))
    }
}