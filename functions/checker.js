const { MessageEmbed } = require("discord.js");
const moment = require('moment');
let duplicates = [];
module.exports = async (bot, message, args) => {
    // Grab DB Data
    let mentorID; let questions; let color; let reportID
    await database.doc('qotd-manager').get().then(doc => {
        mentorID = doc.data().mentorChannelID;
    });
    await database.doc('reports-manager').get().then(doc => {
        questions = doc.data().questions
        color = doc.data().reportsColor
        reportID = doc.data().queueChannelID
    })
    if (message.channel.name == 'qotd-answers') {
        const targetChan = await bot.channels.cache.get(mentorID)
        await message.react('🎟️')
        const questionMsg = new MessageEmbed()
            .setTitle(`QOTD | Answer | ${message.author.tag}`)
            .setDescription(`<@${message.author.id}> has answered the QOTD in <#${message.channel.id}>\nPlease use the emojis below to mark the answer as correct, incorrect, or error.`)
            .addField(`${message.author.tag}'s Answer:`, `${message.content}`)
            .setColor(color)
            .setFooter('QOTD | Checker\n✅ Mark as correct\n🚫 Mark as incorrect\n♻️ Ignore Answer & Delete message')
            .setTimestamp()

        const responseMsg = new MessageEmbed()
            .setTitle(`QOTD | Answer | ${message.author.tag}`)
            .setColor(color)
            .setFooter('QOTD | Trainee')
            .setTimestamp()

        targetChan.send(questionMsg).then(async m => {
            await m.react('✅'); await m.react('🚫'); await m.react('♻️');
            const filter = (reaction, user) => user.id !== bot.user.id;
            const collector = m.createReactionCollector(filter);
            collector.on('collect', async (reaction, user) => {
                collector.stop();
                if (reaction.emoji.name == '♻️') {
                    await m.delete();
                    return await message.delete();
                }
                if (reaction.emoji.name == '🚫') {

                    const targetM = await m.channel.send(`Reason for denial?`)
                    const filter = me => me.author.id !== bot.user.id
                    let reasonstuff;
                    await m.channel.awaitMessages(filter, { max: 1 }).then(async collected => { reasonstuff = collected.first().content; await collected.first().delete(); await targetM.delete() });

                    await m.reactions.removeAll();
                    questionMsg.setColor('#8B0000').setDescription(`<@${user.id}> has marked this answer as **Incorrect**\nReason: ${reasonstuff}`).setFooter('QOTD | Mentor')
                    responseMsg.setDescription(`<@${message.author.id}> your answer has been marked as **Incorrect** by <@${user.id}>\nReason: ${reasonstuff}`).setColor('#8B0000')
                    await m.edit(questionMsg)
                    await message.channel.send(`<@${message.author.id}>`, responseMsg)
                    await message.reactions.removeAll();

                    // Add Info to Mentee DB
                    const menteeRef = dbmentees.doc(message.author.id)
                    await menteeRef.get().then(async (doc) => {
                        if (doc.exists) {
                            await dbmentees.doc(message.author.id).get().then(snap => {
                                gqotd = snap.data().qotdAnswers;
                                wqotd = snap.data().qotdAnswersWeekly;
                            })
                            await save.collection('mentees').doc(message.author.id).update({ qotdAnswers: [(gqotd[0] + 1), gqotd[1], (gqotd[2] + 1)], qotdAnswersWeekly: [(wqotd[0] + 1), wqotd[1], (wqotd[2] + 1)] })
                        }
                    });

                    return message.react('🚫')
                }
                if (reaction.emoji.name == '✅') {
                    await m.reactions.removeAll();
                    questionMsg.setColor('#008000').setDescription(`<@${user.id}> has marked this answer as **Correct**`).setFooter('QOTD | Mentor')
                    responseMsg.setDescription(`<@${message.author.id}> your answer has been marked as **Correct** by <@${user.id}>`).setColor('#008000')
                    await m.edit(questionMsg)
                    await message.channel.send(`<@${message.author.id}>`, responseMsg)
                    await message.reactions.removeAll();

                    // Add Info to Mentee DB
                    const menteeRef = dbmentees.doc(message.author.id)
                    await menteeRef.get().then(async (doc) => {
                        if (doc.exists) {
                            await dbmentees.doc(message.author.id).get().then(snap => {
                                gqotd = snap.data().qotdAnswers;
                                wqotd = snap.data().qotdAnswersWeekly;
                            })
                            await save.collection('mentees').doc(message.author.id).update({ qotdAnswers: [(gqotd[0] + 1), (gqotd[1] + 1), gqotd[2]], qotdAnswersWeekly: [(wqotd[0] + 1), (wqotd[1] + 1), wqotd[2]] })
                        }
                    });
                    return message.react('✅')
                }
            })
        })

    }
    if (message.channel.name == 'staff-reports' && message.content !== 'start' && !duplicates.includes(message.channel.id)) {
        message.delete()
    }
    if (message.channel.name == 'staff-reports' && message.content == 'start' && !duplicates.includes(message.channel.id)) {
        duplicates.push(message.channel.id);
        await message.react('🎟️'); let answers = [];
        const qEmbed = new MessageEmbed()
            .setTitle(`Staff Report Questions`)
            .setDescription(questions[0])
            .setColor(color)
            .setFooter('Staff Report | Trainee')
            .setTimestamp()
        const targetM = await message.channel.send(`<@${message.author.id}>`)
        for (i = 0; i < questions.length; i++) {
            qEmbed.setDescription(`${questions[i]}`)
            if (i == 1) {
                answers.push(`${message.author.username}`)
            } else {
                if (i == 2) {
                    qEmbed.setDescription(`${questions[i]}\n\n*Note: This needs to fit within the 100 character limit of the Minecraft chat (that includes /p, the username, and [SR]). DO NOT include /p, the username, or [SR] in this box, as the document will automatically format that for us when you've submitted your SR.*`)
                }
                if (i == 3) {
                    qEmbed.setDescription(`${questions[i]}\n\n*Note: Enter either: \`Chat Offense\`, \`General Offense\`, \`Hacking Offense\`*`)
                }
                if (i == 4) {
                    qEmbed.setDescription(`${questions[i]}\n\n*Note: Enter either: \`Severity 1\`, \`Severity 2\`, \`Severity 3\`, \`Severity 4 (Permanent Ban or Mute)\`*`)
                }
                if (i == 5) {
                    qEmbed.setDescription(`${questions[i]}\n\n*Note: Please provide the most sufficient evidence you have in the form of a URL and nothing else. YouTube videos must be public for us to view them. Do not use evidence over 48 hours old. ONLY USE YOUR OWN EVIDENCE.*`)
                }
                if (i == 6) {
                    qEmbed.setDescription(`${questions[i]}\n\n*Note: Include anything we need to know when processing your SR. [IF YOU ARE BEDROCK THEN INCLUDE THE PUNISHMENT CODE HERE]*`)
                }
                await targetM.edit(qEmbed)

                const filter = m => m.author.id == message.author.id;
                await message.channel.awaitMessages(filter, { max: 1 }).then(async collected => { answers.push(collected.first().content); await collected.first().delete(); });
            }
        }
        targetM.delete();
        setTimeout(function () { duplicates.splice(duplicates.indexOf(message.channel.id)) }, 1500);
        const summaryEmbed = new MessageEmbed().setTitle('Staff Report Submitted').setDescription(`Report Details`).setColor(color)
        for (i = 0; i < answers.length; i++) {
            summaryEmbed.addField(questions[i], answers[i])
        }
        message.delete()
        const newTarget = await message.channel.send(summaryEmbed)
        const reportChannel = await bot.channels.cache.get(reportID)
        const responseMsg = new MessageEmbed()
            .setTitle(`SR | Answer | ${message.author.tag}`)
            .setColor(color)
            .setFooter('SR | Trainee')
            .setTimestamp()
        summaryEmbed.setTitle(`Staff Report | Answer | ${message.author.tag}`)
            .setDescription(`<@${message.author.id}> has submitted a staff report in <#${message.channel.id}>\nPlease use the emojis below to mark this report as correct, incorrect, or error.`)
            .setColor(color)
            .setFooter('SR | Checker\n✅ Mark as correct\n🚫 Mark as incorrect\n♻️ Ignore Answer & Delete message')
            .setTimestamp()
        reportChannel.send(summaryEmbed).then(async m => {
            await m.react('✅'); await m.react('🚫'); await m.react('♻️');
            const filter = (reaction, user) => user.id !== bot.user.id;
            const collector = m.createReactionCollector(filter);
            collector.on('collect', async (reaction, user) => {
                collector.stop();
                if (reaction.emoji.name == '♻️') {
                    newTarget.delete()
                    return await m.delete();
                }
                if (reaction.emoji.name == '🚫') {

                    const targetM = await m.channel.send(`Reason for denial?`)
                    const filter = me => me.author.id !== bot.user.id
                    let reasonstuff;
                    await m.channel.awaitMessages(filter, { max: 1 }).then(async collected => { reasonstuff = collected.first().content; await collected.first().delete(); await targetM.delete() });

                    await m.reactions.removeAll();
                    summaryEmbed.setColor('#8B0000').setDescription(`<@${user.id}> has marked this report as **Incorrect**\nReason: ${reasonstuff}`).setFooter('SR | Mentor')
                    responseMsg.setDescription(`<@${message.author.id}> your report has been marked as **Incorrect** by <@${user.id}>\nReason: ${reasonstuff}`).setColor('#8B0000')
                    await m.edit(summaryEmbed)
                    summaryEmbed.setColor('#8B0000').setFooter(`SR | TRAINEE`).setTitle('Staff Report | Feedback')
                    newTarget.edit(summaryEmbed)
                    await message.author.send(`<@${message.author.id}>`, responseMsg)

                    // Add Info to Mentee DB
                    const menteeRef = dbmentees.doc(message.author.id)
                    await menteeRef.get().then(async (doc) => {
                        if (doc.exists) {
                            await dbmentees.doc(message.author.id).get().then(snap => {
                                gReports = snap.data().reports;
                                wReports = snap.data().weeklyReports;
                            })
                            await save.collection('mentees').doc(message.author.id).update({ reports: [(gReports[0] + 1), gReports[1], (gReports[2] + 1)], weeklyReports: [(wReports[0] + 1), wReports[1], (wReports[2] + 1)] })
                        }
                    });

                    return
                }
                if (reaction.emoji.name == '✅') {
                    await m.reactions.removeAll();
                    summaryEmbed.setColor('#008000').setDescription(`<@${user.id}> has marked this answer as **Correct**`).setFooter('SR | Mentor')
                    responseMsg.setDescription(`<@${message.author.id}> your report has been marked as **Correct** by <@${user.id}>`).setColor('#008000')
                    await m.edit(summaryEmbed)
                    summaryEmbed.setColor('#008000').setFooter(`SR | TRAINEE`).setTitle('Staff Report | Feedback')
                    newTarget.edit(summaryEmbed)
                    // await message.author.send(`<@${message.author.id}>`, responseMsg)
                    // Don't Send Message || await message.channel.send(`<@${message.author.id}>`, responseMsg)

                    // Add Info to Mentee DB
                    const menteeRef = dbmentees.doc(message.author.id)
                    await menteeRef.get().then(async (doc) => {
                        if (doc.exists) {
                            await dbmentees.doc(message.author.id).get().then(snap => {
                                gReports = snap.data().reports;
                                wReports = snap.data().weeklyReports;
                            })
                            await save.collection('mentees').doc(message.author.id).update({ reports: [(gReports[0] + 1), (gReports[1] + 1), gReports[2]], weeklyReports: [(wReports[0] + 1), (wReports[1] + 1), wReports[2]] })
                        }
                    });
                    return
                }
            })
        })

    }

}