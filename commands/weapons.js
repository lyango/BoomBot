const Discord = require("discord.js");
const PREFIX = process.env.PREFIX;
const fetch = require('node-fetch');

module.exports = {
    name: "weapons",
    alias: ["weapon", "w"],
    description: "returns all playable weapons \n" + `use ${PREFIX}weapons {weapon name} to see details about a specific weapon`,
    run: async (client, message, args) => {
        if (args[0] == undefined) {
            const weaponsEmbed = new Discord.MessageEmbed()
                .setColor("#fc0303")
                .setTitle("Arsenal")
                .setDescription(`Use ${PREFIX}weapons/weapon/w {weapon name} for more details`);

            let url = 'https://playvalorant.com/page-data/en-us/arsenal/page-data.json';
            let settings = { method: "Get" };
            fetch(url, settings)
                .then(res => res.json())
                .then((json) => {
                    var weapons = json.result.data.allContentstackArsenal.nodes[0].weapons_list.weapons;
                    for (i = 0; i < weapons.length; i++) {
                        let name = weapons[i].weapon_name;
                        //let description = weapons[i].weapon_hover_description[0];
                        let category = weapons[i].weapon_category_machine_name;

                        weaponsEmbed.addFields
                        ({ 
                            name: name, 
                            value: category.charAt(0).toUpperCase() + category.slice(1), 
                            inline: true 
                        });
                    }
                })
                .then(weapons => {
                    message.channel.send(weaponsEmbed);
                })
        }
        else {
            const weaponEmbed = new Discord.MessageEmbed()
                .setColor("#ffffff");

            let url = 'https://playvalorant.com/page-data/en-us/arsenal/page-data.json';
            let settings = { method: "Get" };

            var name = "unknown" // default name
            var wNum = null // default weapon number

            fetch(url, settings)
                .then(res => res.json())
                .then((json) => {
                    var weapons = json.result.data.allContentstackArsenal.nodes[0].weapons_list.weapons;
                    for (i = 0; i < weapons.length; i++) {
                        // if user args matches an actual weapon
                        if (args[0].toLowerCase() == weapons[i].weapon_name.toLowerCase()) {
                            name = args[0]; // name is the weapon found
                            wNum = i;
                        }
                    }

                    // if weapon is real
                    if (wNum != null) {
                        weaponEmbed
                            .setTitle(name.toUpperCase())
                            .setURL(`https://playvalorant.com/en-us/arsenal/${weapons[wNum].weapon_category_machine_name}/`)
                            .addField(weapons[wNum].weapon_category_machine_name.toUpperCase(), weapons[wNum].weapon_hover_description[0])
                            .setImage(weapons[wNum].weapon_asset.url)
                            .setFooter("Data from https://playvalorant.com/en-us/");
                    }
                })
                .then(weapons => {
                    if (wNum == null) {
                        message.channel.send("Weapon " + args[0] + " does not exist!")
                        return;
                    }
                    else {
                        message.channel.send(weaponEmbed);
                    }
                })
        }

    }
}
