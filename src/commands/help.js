const { MessageEmbed } = require('discord.js');
const { ErrorEmbed, GetGuildPrefix } = require('../utils/utils');
const fs = require('fs');

module.exports = {
	name: 'help',
	description: 'Just here to help!',
	usage: "[command]",
	category: 'Utility',
	async execute(client, message, args) {
        let user = message.author;
		let prefix = await GetGuildPrefix(message.guild.id)

		if (args.length === 0) {
			let e = new MessageEmbed()
				.setAuthor("Help", user.displayAvatarURL())
				.setDescription("The current guild prefix is: `" + prefix + "`\nUse `" + prefix + "help <command>` to receive help for any command!")
				.setColor([11, 61, 94])
				.addField("General", "`help`, `ping`, `report`, `botstats`")
				.addField("Game", "`create`, `alliance`, `daily`, `match`, `inventory`, `profile`, `train`, `crates`")
				.addField("Moderation", "`prefix`")
			message.channel.send(e)
		}

		if (args.length > 0) {
			let command = args[0];
			if (command) {
				let cmd = client.commands.get(command);
				if (!cmd) return ErrorEmbed(message.channel, user, "no such command `" + command + "`.")

				let msg = `Description: \`${cmd.description}\``

				if (cmd.usage) {
					msg += `\nUsage: \`${cmd.usage}\``
				} else {
					msg += `\nUsage: \`No usage\``
				}

				let h = new MessageEmbed()
					.setAuthor("Help for " + command)
					.setColor([11, 61, 94])
					.setDescription(msg);
				message.channel.send(h)
			}
		}



		
	},
};