const Discord = require("discord.js");
const PREFIX = process.env.PREFIX;
const fetch = require('node-fetch');

module.exports = {
    name: "agents",
    description: "returns all playable valorant agents \n" + `use ${PREFIX}agents {agent name} to see details about a specific agent`,
    run: async (client, message, args) => {
        if (args[0] == undefined) {
            const agentsEmbed = new Discord.MessageEmbed()
                .setColor("#fc0303")
                .setTitle("Valorant Agents")
                .setDescription(`Use ${PREFIX}agents {agent name} for more details`);

            let url = 'https://playvalorant.com/page-data/en-us/agents/page-data.json';
            let settings = { method: "Get" };
            fetch(url, settings)
                .then(res => res.json())
                .then((json) => {
                    for (i = 0; i < json.result.data.allContentstackAgentList.nodes[0].agent_list.length; i++) {
                        let name = json.result.data.allContentstackAgentList.nodes[0].agent_list[i].title;
                        let description = json.result.data.allContentstackAgentList.nodes[0].agent_list[i].description;
                        let role = json.result.data.allContentstackAgentList.nodes[0].agent_list[i].role;

                        agentsEmbed.addField(name + ` | ${role}`, description);
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
                    for (i = 0; i < json.result.data.allContentstackAgentList.nodes[0].agent_list.length; i++) {
                        // if user args matches an actual agent
                        if (args[0].toLowerCase() == json.result.data.allContentstackAgentList.nodes[0].agent_list[i].title.toLowerCase()) {
                            console.log("args: " + args[0]);
                            console.log("json title: " + json.result.data.allContentstackAgentList.nodes[0].agent_list[i].title);
                            console.log("found!");
                            name = args[0]; // name is the agent found
                            agentNum = i;
                        }
                    }

                    // if agent is real
                    if (agentNum != null) {
                        agentEmbed
                            .setTitle(name.charAt(0).toUpperCase() + name.slice(1))
                            .setThumbnail(json.result.data.allContentstackAgentList.nodes[0].agent_list[agentNum].role_icon.url)
                            .setDescription(json.result.data.allContentstackAgentList.nodes[0].agent_list[agentNum].description)
                            .setImage(json.result.data.allContentstackAgentList.nodes[0].agent_list[agentNum].agent_image.url)
                            .addField(`${json.result.data.allContentstackAgentList.nodes[0].agent_list[agentNum].role}`)
                            .setFooter("Data from https://playvalorant.com/en-us/");
                    }

                })
                .then(agents => {
                    if (agentNum == null) {
                        message.channel.send("Agent does not exist!")
                        return;
                    }
                    else {
                        message.channel.send(agentEmbed);
                    }
                })
        }

    }
}
