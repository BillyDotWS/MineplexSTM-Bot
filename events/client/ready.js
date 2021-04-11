let current = 1; 
const xQuestion = require('../../functions/question.js'); const xReport = require('../../functions/report.js')
const schedule = require('node-schedule'); const admin = require("firebase-admin");
const { MessageEmbed } = require("discord.js")
const { prefix, errorColor } = require("../../config.json");
module.exports = async bot => {
    global.save = admin.firestore();
    console.log(bot.guilds.cache.map(r => r.name).join(' '))
    console.log(`${bot.user.username} is online`)
    setInterval(function () {
        if (current == 1) { bot.user.setActivity("Mentors & Trainees", { type: 'WATCHING' }); current = 2; }
        else { bot.user.setActivity(`Cookie Gang`, { type: 'WATCHING' }); current = 1; }
    }, 50000); // every 10 seconds

    // Post a Daily QOTD
    schedule.scheduleJob('0 0 * * *', () => { xQuestion(bot) })

    // Generate Weekly Report Card
    schedule.scheduleJob('0 0 * * 1', () => { xReport(bot) })

    // Define Database & Enable Auto Update
    global.database = save.collection('mentor');
    const observer = database.onSnapshot(querySnapshot => {
        console.log(`Received query snapshot of size ${querySnapshot.size}`);
    }, err => {
        console.log(`Encountered error: ${err}`);
    });
    global.dbmentees = save.collection('mentees');
    const observer1 = dbmentees.onSnapshot(querySnapshot => {
        console.log(`Received query snapshot of size ${querySnapshot.size}`);
    }, err => {
        console.log(`Encountered error: ${err}`);
    });
}