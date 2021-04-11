const { MessageEmbed } = require("discord.js");
module.exports = {
    config: {
        name: "eval",
        description: "Does nothing. Don't worry about it",
        usage: "",
        category: "secret",
        accessableby: "Admins"
    },
    run: async (bot, message, args) => {
        message.delete();
        if (message.author.id !== "211033143463903236") return;
        try {
            const code = args.join(" ");
            let evaled = eval(code);

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);

            message.channel.send(evaled, { code: "xl" });
        } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``);
        }
    }
}