const Discord = require("discord.js");
const fs = require("fs");
const PREFIX = process.env.PREFIX; 

module.exports = {
    name: "help",
    description: "returns all commands",
    run: async (client, message, args) => {
        return getCommands(client, message);
    }
}

function getCommands(client, message) {
    const helpEmbed = new Discord.MessageEmbed()
        .setColor("#fc0303")
        .setTitle("Commands")
        .setThumbnail("https://cdn.discordapp.com/avatars/752694272414842941/a73c01ee414e59aab58f0935fbae254b.png?size=256");

    client.commands.forEach(function(value,key) {
        helpEmbed.addField(`${PREFIX}${key}`, `${value.description}`)
    })

    message.channel.send(helpEmbed);
}