const { MessageEmbed } = require('discord.js')
const { ErrorEmbed, GetGuildPrefix } = require('../utils/utils');

module.exports = {
	name: 'botstats',
	description: 'See the current bot stats!',
	category: 'General',
    async execute(client, message, args) {

        let users = 0;

        client.guilds.cache.forEach((guild) => {
            users += guild.memberCount;
        })

        let e = new MessageEmbed()
            .setAuthor("Kirito stats", client.user.avatarURL({ dynamic: true }))
            .setColor([11, 61, 94])
            .addField("Users", users, true)
            .addField("Guilds", client.guilds.cache.size, true)
            .addField("Channels", client.channels.cache.size, true)
        message.channels.send(e)
    },
};