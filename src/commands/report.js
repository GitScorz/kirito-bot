const { MessageEmbed } = require('discord.js');
const { ErrorEmbed } = require('../utils/utils');

module.exports = {
	name: 'report',
	description: 'Help me prevent bugs and other things!',
	category: 'Utility',
	async execute(client, message, args) {
        let user = message.author;

        let e = new MessageEmbed()
			.setAuthor("Report Menu", client.user.avatarURL({ dynamic: true }))
			.setColor([11, 61, 94])
			.addField("1) Bug", "You discovered a bug? Report it here.", false)
			.addField("2) Word Error", "I am not fluid in english so if you catch any word error tell me! (I am Portuguese :flag_pt: btw)", false)
			.addField("3) Suggestion", "Make a suggestion here.", false)
		message.channel.send(e).then(async msg => {
			await msg.react("1️⃣")
			await msg.react("2️⃣")
			await msg.react("3️⃣")
			
			const oneFilter = (reaction, user) => reaction.emoji.name === '1️⃣' && user.id === message.author.id;
            const twoFilter = (reaction, user) => reaction.emoji.name === '2️⃣' && user.id === message.author.id;
			const threeFilter = (reaction, user) => reaction.emoji.name === '3️⃣' && user.id === message.author.id;

			const bug = msg.createReactionCollector(oneFilter, { time: 60000 });
			const worderror = msg.createReactionCollector(twoFilter, { time: 60000 });
			const suggestion = msg.createReactionCollector(threeFilter, { time: 60000 });


			bug.on('collect', async () => {
				let buga = new MessageEmbed()
					.setAuthor("Bug", client.user.avatarURL({ dynamic: true }))
					.setColor([11, 61, 94])
					.setDescription("Write your report bellow, or type `cancel` to cancel.")
				msg.edit(buga)

				bug.stop();
				worderror.stop();

				let msgBug = await message.channel.createMessageCollector(u => u.author.id == message.author.id);
				msgBug.on('collect', function(m) {

					let cancel =  new MessageEmbed()
						.setColor([255, 0, 0])
						.setDescription("Canceled!")

					if (m.content.toLowerCase() === "cancel") {
						msg.edit(cancel);
						msgBug.stop();
						return
					}

					let sent = new MessageEmbed()
						.setAuthor("Bug", client.user.avatarURL({ dynamic: true }))
						.setColor([0, 255, 0])
						.setDescription("Your report has been sent, thank you!")
					msg.edit(sent)
					ReportEmbed("bug", m.content, user.id, user.tag)
					msgBug.stop();
				})

			});

			
			worderror.on('collect', async () => {
				let wordErr = new MessageEmbed()
					.setAuthor("Word Error", client.user.avatarURL({ dynamic: true }))
					.setColor([11, 61, 94])
					.setDescription("Write your report bellow, or type `cancel` to cancel.")
				msg.edit(wordErr)

				bug.stop();
				worderror.stop();

				let msgWordR = await message.channel.createMessageCollector(u => u.author.id == message.author.id);
				msgWordR.on('collect', function(m) {

					let cancel =  new MessageEmbed()
						.setColor([255, 0, 0])
						.setDescription("Canceled!")

					if (m.content.toLowerCase() === "cancel") {
						msg.edit(cancel);
						msgWordR.stop();
						return
					}

					let sent = new MessageEmbed()
						.setAuthor("Word Error", client.user.avatarURL({ dynamic: true }))
						.setColor([0, 255, 0])
						.setDescription("Your report has been sent, thank you!")
					msg.edit(sent)
					ReportEmbed("worderror", m.content, user.id, user.tag)
					msgWordR.stop()
				})

			});


			suggestion.on('collect', async () => {
				let suggestE = new MessageEmbed()
					.setAuthor("Suggestion", client.user.avatarURL({ dynamic: true }))
					.setColor([11, 61, 94])
					.setDescription("Write your suggestion bellow, or type `cancel` to cancel.")
				msg.edit(suggestE)

				bug.stop();
				worderror.stop();
				suggestion.stop();

				let msgSuggestion = await message.channel.createMessageCollector(u => u.author.id == message.author.id);
				msgSuggestion.on('collect', function(m) {

					let cancel =  new MessageEmbed()
						.setColor([255, 0, 0])
						.setDescription("Canceled!")

					if (m.content.toLowerCase() === "cancel") {
						msg.edit(cancel);
						msgSuggestion.stop();
						return
					}

					let sent = new MessageEmbed()
						.setAuthor("Suggestion", client.user.avatarURL({ dynamic: true }))
						.setColor([0, 255, 0])
						.setDescription("Your suggestion has been sent, thank you!")
					msg.edit(sent)
					ReportEmbed("suggestion", m.content, user.id, user.tag)
					msgSuggestion.stop();
				})

			});


		})

		function ReportEmbed(type, msg, userid, usertag) {
			if (type === "bug") {
				
				let e = new MessageEmbed()
					.setAuthor("New Bug")
					.setDescription(`User ID: \`${userid}\``
									+ `\nUser Tag: \`${usertag}\``
									+ "\n\n**Bug:**"
									+ `\n\`${msg}\``)
					.setColor([255, 0, 0])
				client.channels.cache.get("854093507257958450").send(e)
				return;

			} else if (type === "worderror") {

				let e = new MessageEmbed()
					.setAuthor("New Word Error")
					.setDescription(`User ID: \`${userid}\``
									+ `\nUser Tag: \`${usertag}\``
									+ "\n\n**Word Error:**"
									+ `\n\`${msg}\``)
					.setColor([255, 0, 0])
				client.channels.cache.get("854093661863542885").send(e)
				return;

			} else if (type === "suggestion") {

				let e = new MessageEmbed()
					.setAuthor("New Suggestion")
					.setDescription(`User ID: \`${userid}\``
									+ `\nUser Tag: \`${usertag}\``
									+ "\n\n**Suggestion:**"
									+ `\n\`${msg}\``)
					.setColor([0, 255, 0])
				client.channels.cache.get("854093718092251187").send(e)
				return;

			}
		}
	},
};