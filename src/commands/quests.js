const { MessageEmbed } = require('discord.js');
const Character = require('../schemas/CharacterSchema');
const { ErrorEmbed } = require('../utils/utils');

module.exports = {
	name: 'quests',
	description: 'See your current quests!',
    category: 'Game',
	async execute(client, message, args) {
        let user = message.author;

        const characterDB = await Character.findOne({ userId: user.id });
        if (!characterDB) return ErrorEmbed(message.channel, user, "to use this command you need to create a character!")

        return ErrorEmbed("soon..")

	},
};