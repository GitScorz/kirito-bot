const { MessageEmbed } = require('discord.js');
const Character = require('../schemas/CharacterSchema');
const { ErrorEmbed, GetGuildPrefix } = require('../utils/utils');

module.exports = {
	name: 'profile',
	description: 'Your profile!',
	category: 'Game',
	async execute(client, message, args) {
		let user = message.author;

		const characterDB = await Character.findOne({ userId: user.id });
        if (!characterDB) return ErrorEmbed(message.channel, user, "to use this command you need to create a character!")
		let prefix = await GetGuildPrefix(message.guild.id)

		
		let name = characterDB.name;
		let health = characterDB.health;
		let potionEffect = characterDB.potionEffect;
		let wins = characterDB.wins;
		let loss = characterDB.loss;
		let troops = characterDB.troops;
		let gold = characterDB.gold;
		let alliance = characterDB.alliance;
		let matches = characterDB.matches;

		let msg = "🍃 ***Character Stats*** 🍃"
		msg += `\nName: \`${name}\``
		msg += `\nHealth: \`${health}/100\` <:life_hp:853288570113359872>`

		if (potionEffect !== "None") {
			msg += `\nPotion Effect: \`${potionEffect}\``
		}

		msg += `\nTroops: \`${troops}\` <:swordman:851863017389686804>`
		msg += `\nGold: \`${gold}\` <:gold:851858239284969473>`
		msg += `\n\n:crossed_swords: ***Fight Stats*** :crossed_swords:`
		msg += `\nMatches: \`${matches}\``
		msg += `\nWins: \`${wins}\``
		msg += `\nLosses: \`${loss}\``
		msg += `\n\n<:shield:851859680786907166> ***Alliance Stats*** <:shield:851859680786907166>`

		if (alliance === "None") {
			msg += "\nNo alliance, join one with `"+ prefix +"alliance`."
		} else {
			msg += "\nSoon.."
		}


		let e = new MessageEmbed()
			.setAuthor(`${user.username}'s Profile`)
			.setColor([11, 61, 94])
			.setDescription(msg)
			.setThumbnail(user.displayAvatarURL({ dynamic: true }))

		message.channel.send(e)
	},
};