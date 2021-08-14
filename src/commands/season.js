const { MessageEmbed } = require('discord.js');
const Character = require('../schemas/CharacterSchema');
const { ErrorEmbed } = require('../utils/utils');

module.exports = {
	name: 'season',
	description: 'See current season stats!',
    category: 'Game',
	async execute(client, message, args) {
        let user = message.author;

        const characterDB = await Character.findOne({ userId: user.id });
        if (!characterDB) return ErrorEmbed(message.channel, user, "to use this command you need to create a character!")

        if (args.length === 0) {
            let e = new MessageEmbed()
                .setAuthor("Season")
                .setColor([11, 61, 94])
                .setDescription("The current season is: `1`")
            message.channel.send(e)
        }
	},
};