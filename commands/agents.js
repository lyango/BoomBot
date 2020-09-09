const Discord = require("discord.js");
const PREFIX = process.env.PREFIX;
const fetch = require('node-fetch');

module.exports = {
    name: "agents",
    alias: ["agent", "a"],
    description: "returns all playable valorant agents \n" + `use ${PREFIX}agents {agent name} to see details about a specific agent`,
    run: async (client, message, args) => {
        if (args[0] == undefined) {
            const agentsEmbed = new Discord.MessageEmbed()
                .setColor("#fc0303")
                .setTitle("Agents")
                .setDescription(`Use ${PREFIX}agents/agent/a {agent name} for more details`);

            let url = 'https://playvalorant.com/page-data/en-us/agents/page-data.json';
            let settings = { method: "Get" };
            fetch(url, settings)
                .then(res => res.json())
                .then((json) => {
                    var agents = json.result.data.allContentstackAgentList.nodes[0].agent_list;
                    for (i = 0; i < agents.length; i++) {
                        let name = agents[i].title;
                        //let description = agents[i].description;
                        let role = agents[i].role;

                        agentsEmbed.addFields
                        ({ 
                            name: name, 
                            value: role, 
                            inline: true 
                        });
                    }
                })
                .then(agents => {
                    message.channel.send(agentsEmbed);
                })
        }
        else {
            const agentEmbed = new Discord.MessageEmbed()
                .setColor("#ffffff");

            let url = 'https://playvalorant.com/page-data/en-us/agents/page-data.json';
            let settings = { method: "Get" };

            var name = "unknown" // default name
            var agentNum = null // default agent number

            fetch(url, settings)
                .then(res => res.json())
                .then((json) => {
                    var agents = json.result.data.allContentstackAgentList.nodes[0].agent_list;
                    for (i = 0; i < agents.length; i++) {
                        // if user args matches an actual agent
                        if (args[0].toLowerCase() == agents[i].title.toLowerCase()) {
                            name = args[0]; // name is the agent found
                            agentNum = i;
                        }
                    }

                    // if agent is real
                    if (agentNum != null) {
                        let urlname = name.toLowerCase();
                        agentEmbed
                            .setTitle(name.toUpperCase())
                            .setURL(`https://playvalorant.com/en-us/agents/${urlname}/`)
                            .setThumbnail(agents[agentNum].role_icon.url)
                            .addField(agents[agentNum].role.toUpperCase(), agents[agentNum].description)
                            .setImage(agents[agentNum].agent_image.url)
                            .addFields(
                                {
                                    // spacing
                                    name: '\u200B',
                                    value: '\u200B',
                                    inline: false
                                },
                                {
                                    // Q ability
                                    name: agents[agentNum].abilities[0].ability_name,
                                    value: agents[agentNum].abilities[0].ability_description,
                                    inline: false
                                },
                                {
                                    // E ability
                                    name: agents[agentNum].abilities[1].ability_name,
                                    value: agents[agentNum].abilities[1].ability_description,
                                    inline: false
                                },
                                {
                                    // C ability
                                    name: agents[agentNum].abilities[2].ability_name,
                                    value: agents[agentNum].abilities[2].ability_description,
                                    inline: false
                                },
                            )
                            .setFooter("Data from https://playvalorant.com/en-us/");
                    }

                })
                .then(agents => {
                    if (agentNum == null) {
                        message.channel.send("Agent " + args[0] + " does not exist!")
                        return;
                    }
                    else {
                        message.channel.send(agentEmbed);
                    }
                })
        }

    }
}
