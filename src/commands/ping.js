const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'ping',
	description: 'Get the bot ping!',
    category: 'Utility',
	async execute(client, message, args) {
        let a = new MessageEmbed()
            .setDescription("Calculating..")
            .setColor([11, 61, 94])
        let m = await message.channel.send(a);

        let e = new MessageEmbed()
            .setAuthor("Latency!", client.user.avatarURL({ dynamic: true }))
            .setDescription(`Pong! :ping_pong: \nLatency is **${m.createdTimestamp - message.createdTimestamp}**ms.\nAPI Latency is **${Math.round(client.ws.ping)}**ms.`)
            .setColor([11, 61, 94])
            .setTimestamp();

        m.edit(e);
	},
};