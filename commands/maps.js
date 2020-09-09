const Discord = require("discord.js");
const PREFIX = process.env.PREFIX;
const fetch = require('node-fetch');

module.exports = {
    name: "maps",
    alias: ["map", "m"],
    description: "returns all playable maps \n" + `use ${PREFIX}maps {agent name} to see details about a specific map`,
    run: async (client, message, args) => {
        if (args[0] == undefined) {
            const mapsEmbed = new Discord.MessageEmbed()
                .setColor("#fc0303")
                .setTitle("Maps")
                .setDescription(`Use ${PREFIX}maps/map/m {map name} for more details`);

            let url = 'https://playvalorant.com/page-data/en-us/maps/page-data.json';
            let settings = { method: "Get" };
            fetch(url, settings)
                .then(res => res.json())
                .then((json) => {
                    var maps = json.result.pageContext.data.maps.map_list;
                    for (i = 0; i < maps.length; i++) {
                        let name = maps[i].map_name;
                        let description = maps[i].map_description;

                        mapsEmbed.addField(name, description);
                    }
                })
                .then(maps => {
                    message.channel.send(mapsEmbed);
                })
        }
        else {
            const mapEmbed = new Discord.MessageEmbed()
                .setColor("#ffffff");

            let url = 'https://playvalorant.com/page-data/en-us/maps/page-data.json';
            let settings = { method: "Get" };

            var name = "unknown" // default name
            var mapNum = null // default map number

            fetch(url, settings)
                .then(res => res.json())
                .then((json) => {
                    var maps = json.result.pageContext.data.maps.map_list;
                    for (i = 0; i < maps.length; i++) {
                        // if user args matches an actual map
                        if (args[0].toLowerCase() == maps[i].map_name.toLowerCase()) {
                            name = args[0]; // name is the map found
                            mapNum = i;
                        }
                    }

                    // if map is real
                    if (mapNum != null) {
                        var minimapNum = 0; // default
                        // loop through gallery images to see which is the minimap
                        for (i = 0; i < maps[mapNum].gallery_images.length; i++) {
                            if (maps[mapNum].gallery_images[i].is_minimap == true) {
                                minimapNum = i;
                                break;
                            }
                        }
                        mapEmbed
                            .setTitle(name.toUpperCase())
                            .setURL(`https://playvalorant.com/en-us/maps/`)
                            .setThumbnail(maps[mapNum].map_featured_image_mobile.url)
                            .setDescription(maps[mapNum].map_description)
                            .setImage(maps[mapNum].gallery_images[minimapNum].map_image.url)
                            .setFooter("Data from https://playvalorant.com/en-us/");
                    }
                })
                .then(maps => {
                    if (mapNum == null) {
                        message.channel.send("Map " + args[0] + " does not exist!")
                        return;
                    }
                    else {
                        message.channel.send(mapEmbed);
                    }
                })
        }

    }
}
