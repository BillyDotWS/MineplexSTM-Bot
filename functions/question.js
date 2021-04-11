const { MessageEmbed } = require("discord.js");
const moment = require('moment')
const { prefix, errorColor } = require('../config.json')
module.exports = async (bot) => {

    // Grab DB Data
    let javaID; let bedrockID; let javaRole; let bedrockRole; let javaColor; let bedrockColor; let javaArray = []; let bedrockArray = []; let mentorID;
    await database.doc('qotd-manager').get().then(doc => {
        javaID = doc.data().javaChannelID;
        javaRole = doc.data().javaRoleID;
        bedrockID = doc.data().bedrockChannelID;
        bedrockRole = doc.data().bedrockRoleID;
        javaColor = doc.data().javaColor;
        bedrockColor = doc.data().bedrockColor;
        javaArray = doc.data().javaArray;
        bedrockArray = doc.data().bedrockArray;
        mentorID = doc.data().mentorChannelID;
    });

    if (javaArray.length >= 1) {
        // Send Java
        const targetChan = await bot.channels.cache.get(javaID)
        const questionMsg = new MessageEmbed()
            .setTitle(`**Question of the day ⮕** ${moment().format('DD/MM/YYYY')}`)
            .setDescription(javaArray[0])
            .setColor(javaColor)
            .setFooter('Mentor System | QOTD')
            .setTimestamp()

        await targetChan.send(`<@&${javaRole}>`, questionMsg);

        // Delete question from DB
        javaArray.shift()
        await save.collection('mentor').doc('qotd-manager').update({
            javaArray: javaArray
        })

        // Warn if few questions remaining
        const mentorChan = await bot.channels.cache.get(mentorID)
        if (javaArray.length < 2) {
            mentorChan.send(new MessageEmbed().setTitle('Warning!').setDescription(`There are **${javaArray.length}** questions remaining for java QOTDs\nPlease use:\`${prefix}addq java <your question>\` to ensure you have questions on standby for everyday`).setColor(errorColor))
        }
    }

    if (bedrockArray.length >= 1) {
        // Send Bedrock
        const targetChan = await bot.channels.cache.get(bedrockID)
        const questionMsg = new MessageEmbed()
            .setTitle(`**Question of the day ⮕** ${moment().format('DD/MM/YYYY')}`)
            .setDescription(bedrockArray[0])
            .setColor(bedrockColor)
            .setFooter('Mentor System | QOTD')
            .setTimestamp()

        await targetChan.send(`<@&${bedrockRole}>`, questionMsg);

        // Delete question from DB
        bedrockArray.shift()
        await save.collection('mentor').doc('qotd-manager').update({
            bedrockArray: bedrockArray
        })

        // Warn if few questions remaining
        const mentorChan = await bot.channels.cache.get(mentorID)
        if (bedrockArray.length < 2) {
            mentorChan.send(new MessageEmbed().setTitle('Warning!').setDescription(`There are **${bedrockArray.length}** questions remaining for bedrock QOTDs\nPlease use:\`${prefix}addq bedrock <your question>\` to ensure you have questions on standby for everyday`).setColor(errorColor))
        }

    }

}