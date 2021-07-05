const { MessageEmbed } = require('discord.js');
const Character = require('../schemas/CharacterSchema');
const { ErrorEmbed } = require('../utils/utils');

module.exports = {
	name: 'gold',
	description: 'See your current gold!',
    category: 'Game',
	async execute(client, message, args) {
        let user = message.author;

        const characterDB = await Character.findOne({ userId: user.id });
        if (!characterDB) return ErrorEmbed(message.channel, user, "to use this command you need to create a character!")

        let e = new MessageEmbed()
            .setAuthor(user.username + " Gold", user.displayAvatarURL({ dynamic: true }))
            .setDescription(`Your current gold is **${characterDB.gold}**<:gold:851858239284969473>`)
            .setColor([11, 61, 94])
        message.channel.send(e)

	},
};