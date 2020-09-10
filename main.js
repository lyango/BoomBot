require('dotenv/config')
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require("fs");
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
// command prefix
const PREFIX = process.env.PREFIX;

// read commands
fs.readdir("./commands/", (err, files) => {
    if (err) {
        console.log(err);
    }
    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if (jsfile.length <= 0) {
        console.log("Could not find any commands!");
        return;
    }

    jsfile.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`${f} loaded!`);
        client.commands.set(props.name, props);

        if(props.alias) {
            props.alias.forEach(alias => client.aliases.set(alias, props.name));
        }
    });
});

// console notification
client.once('ready', () => {
    console.log("Boom Bot is online!");
})

// bot ready
client.on('ready', () => {
    client.user.setPresence({
        activity: {
            name: 'being developed'
        },
        status: 'online',
    })
})

// commands
client.on('message', message => {
    if (message.author.bot) {
        return;
    }
    if (message.channel.type === "dm") {
        return;
    }

    let messageArr = message.content.toLowerCase().split(" ");
    let cmd = messageArr[0];
    let args = messageArr.slice(1);

    if(message.content.toLowerCase().startsWith(PREFIX) == false) {
        return;
    }

    let cfile = client.commands.get(cmd.slice(PREFIX.length));
    if(!cfile) {
        cfile = client.commands.get(client.aliases.get(cmd.slice(PREFIX.length)))
    }

    if (cfile) {
        cfile.run(client, message, args);
    }
})

client.login(process.env.TOKEN);