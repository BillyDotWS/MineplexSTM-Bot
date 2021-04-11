const { QOTDCategoryChannelID } = require("../../config.json");
const { MessageEmbed } = require('discord.js')
module.exports = async (bot, oldM, newM) => {

    // Grab DB Data
    let javaRole; let bedrockRole;
    await database.doc('qotd-manager').get().then(doc => {
        javaRole = doc.data().javaRoleID;
        bedrockRole = doc.data().bedrockRoleID;

    });
    // Check if a role was added
    const oldRoles = oldM.roles.cache.array(); const newRoles = newM.roles.cache.array();
    if (oldRoles.length > newRoles.length || oldRoles.length == newRoles.length) return;

    // Check if the added role is Trainee 
    const addedRole = newRoles.filter(x => !oldRoles.includes(x));
    if (addedRole[0].id !== javaRole && addedRole[0].id !== bedrockRole) return;

    let ticketPermsArray2 = [{ id: oldM.guild.id, deny: ["VIEW_CHANNEL", "SEND_MESSAGES"] }];
    // See if channels already exist
    const finder = await oldM.guild.channels.cache.filter(c => c.name == `Mentee: ${oldM.nickname || oldM.user.username}`)
    if (finder.size < 1) {
        // Check if special role exists
        const roleFinder = await oldM.guild.roles.cache.filter(r => r.name == `Mentee: ${oldM.nickname || oldM.user.username}`)
        let ticketPermsArray;
        let outsideRole;
        if (roleFinder.size < 1) {
            // Create a special role
            const makeRole = await oldM.guild.roles.create({ data: { name: `Mentee: ${oldM.nickname || oldM.user.username}` } });
            const positionRole = await oldM.guild.roles.cache.get(bedrockRole)
            await makeRole.setPosition((positionRole.position - 1))
            ticketPermsArray = [{ id: makeRole.id, allow: ["VIEW_CHANNEL", "SEND_MESSAGES"] }, { id: oldM.guild.id, deny: ["VIEW_CHANNEL", "SEND_MESSAGES"] }];
            // Assign Role
            await newM.roles.add(makeRole)
            outsideRole = makeRole
        } else {
            // Assign Role
            const targetRole = roleFinder.array()
            await newM.roles.add(targetRole[0].id)
            ticketPermsArray = [{ id: targetRole[0].id, allow: ["VIEW_CHANNEL", "SEND_MESSAGES"] }, { id: oldM.guild.id, deny: ["VIEW_CHANNEL", "SEND_MESSAGES"] }];
            outsideRole = targetRole[0]
        }

        // Create category
        const newCat = await oldM.guild.channels.create(`Mentee: ${oldM.nickname || oldM.user.username}`, { type: 'category', permissionOverwrites: ticketPermsArray });
        const positionManager = await oldM.guild.channels.cache.get(QOTDCategoryChannelID)
        await newCat.setPosition((positionManager.position + 1))
        // Create rest of channels
        const c1 = await oldM.guild.channels.create(`qotd-answers`, { type: 'text', permissionOverwrites: ticketPermsArray });
        const c2 = await oldM.guild.channels.create(`staff-reports`, { type: 'text', permissionOverwrites: ticketPermsArray });
        const c3 = await oldM.guild.channels.create(`weekly-report`, { type: 'text', permissionOverwrites: ticketPermsArray });
        const c4 = await oldM.guild.channels.create(`private-monitoring`, { type: 'text', permissionOverwrites: ticketPermsArray2 });
        await c1.setParent(newCat.id); await c2.setParent(newCat.id); await c3.setParent(newCat.id); await c4.setParent(newCat.id);
        await c4.updateOverwrite(outsideRole.id, { SEND_MESSAGES: false, VIEW_CHANNEL: false })
        await c3.updateOverwrite(outsideRole.id, { SEND_MESSAGES: false })
        c2.send(new MessageEmbed().setTitle('Staff Report').setDescription('To begin a staff report type **start** below.').setColor('#008000'))
        // Create a Database Entry:
        const menteeRef = dbmentees.doc(oldM.id)
        await menteeRef.get().then(async (doc) => { if (!doc.exists) { await save.collection('mentees').doc(oldM.id).set({ 'id': oldM.id, 'qotdAnswers': [0, 0, 0], 'qotdAnswersWeekly': [0, 0, 0], 'reports': [0, 0, 0], 'weeklyReports': [0, 0, 0], 'regularfp': 0, 'helpfp': 0, 'igt': 0, 'observation': 0, 'sotw': 0 }) } });

    }

}