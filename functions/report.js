const { MessageEmbed } = require("discord.js");
const { guildID } = require('../config.json')
const moment = require('moment')
const format = require('./formater.js')
module.exports = async (bot) => {

    // Grab ID of all Mentees
    let idArray = [];
    await dbmentees.get().then(async function (querySnapshot) { await querySnapshot.forEach(async function (doc) { await doc.ref.get().then(async waw => { idArray.push(waw.data().id); }) }) });
    setTimeout(function () { main(); }, 1000);
    async function main() {

        // Create Report Card for Each Mentee
        for (let i = 0; i < idArray.length; i++) {
            const z = i + 1
            if (z == 1) {
                safety()
            } else {
                setTimeout(function () { safety() }, z * 4000);

            }
            async function safety() {
                await dbmentees.doc(idArray[i]).get().then(async snap => {
                    const mID = snap.data().id;
                    const weeklyQ = snap.data().qotdAnswersWeekly;
                    const weeklyR = snap.data().weeklyReports
                    const fp = snap.data().regularfp
                    const hfp = snap.data().helpfp
                    const observation = snap.data().observation
                    const sotw = snap.data().sotw
                    const igt = snap.data().igt
                    const guild = await bot.guilds.cache.get(guildID)
                    const mentee = await guild.members.cache.get(mID)
                    if (!mentee) return;
                    // Check if user has Mentee Role
                    const roleFilter = await mentee.roles.cache.filter(r => r.name == `Mentee: ${mentee.nickname || mentee.user.username}`)
                    if (roleFilter.size < 1) return;
                    // Check if user has a weekly report channel
                    const chanFilter = await guild.channels.cache.filter(c => c.type == "category" && c.name == `Mentee: ${mentee.nickname || mentee.user.username}`)
                    const category = chanFilter.array()
                    if (category.length < 1) return;
                    // Indentify Report Card Channel
                    const chanfinder = await guild.channels.cache.filter(c => c.name == "weekly-report" && c.type == "text" && c.parentID == category[0].id)
                    const targetChannel1 = chanfinder.array(); const targetChannel = targetChannel1[0]
                    // Generate Embed Report
                    const embed = new MessageEmbed()
                        .setTitle(`**Weekly Report Card ⮕** ${moment().subtract(7, 'days').format('DD/MM/YYYY')} - ${moment().format('DD/MM/YYYY')}`)
                        .addField('Goal', `Expected Results`, true).addField('Achieved', `Your Results`, true)
                        .addField('\u200b', '\u200b', true)
                        .addField('**IGT**', `5+ hours`, true)
                        .addField('**IGT**', `${igt} hours`, true)
                        .addField('\u200b', '\u200b', true)
                        .addField('**Forum Posts**', `3+`, true)
                        .addField('**Forum Posts**', `${fp}`, true)
                        .addField('\u200b', '\u200b', true)
                        .addField('**Help Forum Posts**', `1+`, true)
                        .addField('**Help Forum Posts**', `${hfp}`, true)
                        .addField('\u200b', '\u200b', true)
                        .addField(`**SR**`, `10+`, true)
                        .addField(`**SR**`, `${weeklyR[1]}/0`, true)
                        .addField('\u200b', '\u200b', true)
                        .addField(`**QOTD**`, `7/7`, true)
                        .addField(`**QOTD**`, `${weeklyQ[1]}/7`, true)
                        .addField('\u200b', '\u200b', true)
                        .addField(`**SOTW**`, `10/10`, true)
                        .addField(`**SOTW**`, `${sotw}/10`, true)
                        .addField('\u200b', '\u200b', true)
                        .addField(`**Observation**`, `10/10`, true)
                        .addField(`**Observation**`, `${observation}/10`, true)
                        .addField('\u200b', '\u200b', true)
                        .setColor('#98FB98')
                        .setFooter('Report Card | Mentee')
                        .setTimestamp()

                    // Calculate Total
                    let igtscore; let fpscore; let hfpscore; let srscore; let qotdscore; let sotwscore; let obsscore; let total;
                    igtscore = (igt >= 5 ? 100 : (igt / 5) * 100);
                    fpscore = (fp >= 3 ? 100 : (fp / 3) * 100);
                    hfpscore = (hfp >= 1 ? 100 : (hfp / 1) * 100);
                    srscore = (weeklyR[1] >= 10 ? 100 : (weeklyR[1] / 10) * 100);
                    qotdscore = (weeklyQ[1] >= 7 ? 100 : (weeklyQ[1] / 7) * 100);
                    sotwscore = (sotw >= 10 ? 100 : (sotw / 10) * 100);
                    obsscore = (observation >= 10 ? 100 : (observation / 10) * 100);

                    total = ((igtscore + fpscore + hfpscore + srscore + qotdscore + sotwscore + obsscore) / 7)
                    total = total.toFixed(2)
                    await format(igt, fp, hfp, weeklyR, weeklyQ, sotw, observation, total, igtscore, fpscore, hfpscore, srscore, moment().format('DD/MM/YYYY'))
                    embed.addField(`**TOTAL**`, `**Your Total Score is: ${total}%!**`)
                    embed.attachFiles(['report.png'])
                    embed.setImage('attachment://report.png')
                    // Send it
                    targetChannel.send(`<@${mentee.id}>`, embed)

                    
                    // Reset Weekly DB
                    await save.collection('mentees').doc(mID).update({
                        qotdAnswersWeekly: [0, 0, 0],
                        weeklyReports: [0, 0, 0,],
                        igt: 0,
                        regularfp: 0,
                        helpfp: 0,
                        sotw: 0,
                        observation: 0
                    })
                    
                })
            }

        }
    }

}
