const Discord = require("discord.js");

module.exports = {
    name: "about",
    description: "about the bot",
    run: async (client, message, args) => {
        const aboutEmbed = new Discord.MessageEmbed()
        .setColor("#fc0303")
        .setTitle("BOOM BOT")
        .setDescription("Boom Bot is a Valorant information bot made for Discord. It actively takes data/information from the official" + 
        " Valorant website, and will concurrently update based off Riot Games automatically.")
        .setFooter("Made by Leon / lyango on GitHub / Lyang#5206 on Discord")
        .setThumbnail("https://cdn.discordapp.com/avatars/752694272414842941/a73c01ee414e59aab58f0935fbae254b.png?size=256");
        //.setThumbnail(client.user.displayAvatarURL());

        message.channel.send(aboutEmbed);
    }
}