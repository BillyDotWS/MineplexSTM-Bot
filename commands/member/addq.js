const { MessageEmbed } = require("discord.js")
const { prefix, errorColor } = require('../../config.json')
module.exports = {
    config: {
        name: "addq",
        description: "Adds a new Trainee Question to the DB.",
        usage: "",
        category: "member",
        accessableby: "Members"
    },
    run: async (bot, message, args) => {
        message.delete()
        // Grab DB Data
        let javaArray = []; let bedrockArray = [];
        await database.doc('qotd-manager').get().then(doc => {
            javaArray = doc.data().javaArray;
            bedrockArray = doc.data().bedrockArray;
        });
        const noperms = new MessageEmbed()
            .setTitle('Insufficient Permission')
            .addField('Permissions Needed', '`ADMINISTRATOR`', true)
            .setColor(errorColor)

        if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send(noperms)

        if (!args[0]) return message.channel.send(new MessageEmbed().setTitle(`Invalid Usage`).setDescription(`Please specify bedrock or java`).addField(`Usage:`, `${prefix}qotd <java/bedrock> <new question>`).setColor(errorColor))
        if (args[0] !== "java" && args[0] !== "bedrock") return message.channel.send(new MessageEmbed().setTitle(`Invalid Usage`).setDescription(`Please specify bedrock or java`).addField(`Usage:`, `${prefix}qotd <java/bedrock> <new question>`).setColor(errorColor))
        if (!args[1]) return message.channel.send(new MessageEmbed().setTitle(`Invalid Usage`).setDescription(`Please enter the question you would like to add`).addField(`Usage:`, `${prefix}qotd <java/bedrock> <new question>`).setColor(errorColor))

        const newq = args.slice(1).join(" ");
        if (args[0] == 'java') {
            javaArray.push(newq)
            save.collection('mentor').doc('qotd-manager').update({
                javaArray: javaArray
            })
            message.channel.send(new MessageEmbed().setTitle('Question Added').setDescription(`New **Java** trainee QOTD added\n\`\`\`${newq}\`\`\``).setColor('#98FB98'))
        } else {
            bedrockArray.push(newq)
            save.collection('mentor').doc('qotd-manager').update({
                bedrockArray: bedrockArray
            })
            message.channel.send(new MessageEmbed().setTitle('Question Added').setDescription(`New **Bedrock** trainee QOTD added\n\`\`\`${newq}\`\`\``).setColor('#98FB98'))
        }

    }
}