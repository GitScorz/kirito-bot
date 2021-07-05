const { MessageEmbed } = require('discord.js');
const { ErrorEmbed, GetGuildPrefix } = require('../utils/utils');
const fs = require('fs');

module.exports = {
	name: 'help',
	description: 'Just here to help!',
	category: 'Utility',
	async execute(client, message, args) {
        let user = message.author;
		let prefix = await GetGuildPrefix(message.guild.id)

		let e = new MessageEmbed()
			.setAuthor(`Help Menu`, client.user.avatarURL())
			.setColor([11, 61, 94])
			.setDescription("*New things comming this summer..*")
			.addField("1) General", "General commands!", false)
			.addField("2) Game", "Game commands!", false)	
			.addField("3) Moderation", "Mod things..", false)	
		message.channel.send(e).then(msg => {
			msg.react("1️⃣")
			msg.react("2️⃣")
			msg.react("3️⃣")
			msg.react("⏪")

			const oneFilter = (reaction, user) => reaction.emoji.name === '1️⃣' && user.id === message.author.id;
            const twoFilter = (reaction, user) => reaction.emoji.name === '2️⃣' && user.id === message.author.id;
			const threeFilter = (reaction, user) => reaction.emoji.name === '3️⃣' && user.id === message.author.id;
			const backFilter = (reaction, user) => reaction.emoji.name === '⏪' && user.id === message.author.id;

			const general = msg.createReactionCollector(oneFilter, { time: 60000 });
			const game = msg.createReactionCollector(twoFilter, { time: 60000 });
			const mod = msg.createReactionCollector(threeFilter, { time: 60000 });
			const back = msg.createReactionCollector(backFilter, { time: 60000 });

			general.on('collect', async () => {
				let generale = new MessageEmbed()
					.setAuthor(`General`, client.user.avatarURL())
					.setColor([11, 61, 94])
					.setDescription("`" + prefix + "ping` - Get the bot current ping."
									+ "\n`" + prefix + "report` - Report some bug, word error or do a suggestion!"
									+ "\n`" + prefix + "help` - Shows this command.")
				msg.edit(generale)
			});

			game.on('collect', async () => {
				let gamee = new MessageEmbed()
					.setAuthor(`Game`, client.user.avatarURL())
					.setColor([11, 61, 94])
					.setDescription("`" + prefix + "create` - Create your character."
									+ "\n`" + prefix + "alliance` - Create or join your friends alliance!"
									+ "\n`" + prefix + "daily` - Collect your daily reward!"
									+ "\n`" + prefix + "match` - Matchmaking system, you can search for match in all discord!"
									+ "\n`" + prefix + "inventory` - See what are the items that you have."
									+ "\n`" + prefix + "profile` - Your character profile!"
									+ "\n`" + prefix + "shop` - You can buy potions, items or even crates here."
									+ "\n`" + prefix + "train` - Train your troops to get more troops."
									+ "\n`" + prefix + "crates` - You can open crates here!")
				msg.edit(gamee)
			});

			mod.on('collect', async () => {
				let mode = new MessageEmbed()
					.setAuthor(`Moderation`, client.user.avatarURL())
					.setColor([11, 61, 94])
					.setDescription("`" + prefix + "prefix` - Change the current prefix.")
				msg.edit(mode)
			});

			back.on('collect', async () => {
				let backe = new MessageEmbed()
					.setAuthor(`Help Menu`, client.user.avatarURL())
					.setColor([11, 61, 94])
					.setDescription("*New things comming this summer..*")
					.addField("1) General", "General commands!", false)
					.addField("2) Game", "Game commands!", false)	
					.addField("3) Moderation", "Mod things..", false)	
				msg.edit(backe)
			});
		});
	},
};