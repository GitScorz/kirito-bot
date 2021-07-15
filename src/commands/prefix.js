const { MessageEmbed } = require('discord.js');
const { ErrorEmbed, GetGuildPrefix } = require('../utils/utils');
const GuildSettings = require('../schemas/GuildSchema');

module.exports = {
	name: 'prefix',
	description: 'Prefix!',
    category: 'Moderation',
    usage: '[prefix]',
	async execute(client, message, args) {
        let member = message.member;
        let user = message.author;

        if (!member.hasPermission("MANAGE_MESSAGES")) return ErrorEmbed(message.channel, user, "you need `MANAGE_MESSAGES` permission to change prefix!");

        let prefix = await GetGuildPrefix(message.guild.id);

        if (args.length === 0) {
            let e = new MessageEmbed()
                .setAuthor("Prefix")
                .setDescription("To change the current prefix do `" + prefix + "prefix <new_prefix>`")
                .setColor([11, 61, 94])
            message.channel.send(e)
        }

        if (args.length > 0) {
            let newPrefix = args[0];
            if (newPrefix.length > 4) return ErrorEmbed(message.channel, user, "im sorry but your prefix exceeds `4` characters limit!");
            await GuildSettings.findOneAndUpdate({ guildId: message.guild.id }, { prefix: newPrefix });
            let e = new MessageEmbed()
                .setDescription("Your prefix has been changed to `" + newPrefix + "`")
                .setColor([0, 255, 0])
            message.channel.send(e);
        }
        
	},
};