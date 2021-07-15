const { MessageEmbed } = require('discord.js');
const Character = require('../schemas/CharacterSchema');
const { ErrorEmbed, GetGuildPrefix } = require('../utils/utils');

module.exports = {
	name: 'create',
	description: 'Create your character!',
        category: 'Game',
        usage: '[character_name]',
	async execute(client, message, args) {
        const user = message.author;
        const uid = user.id

        const characterDB = await Character.findOne({ userId: uid });
        let Name = args.join(' ')
        const characterNameDB = await Character.findOne({ name: Name });

        if (characterDB) return ErrorEmbed(message.channel, user, "you already have a character!");

        let prefix = await GetGuildPrefix(message.guild.id)

        if (!Name) return ErrorEmbed(message.channel, user, "please use the following format `" + prefix + "create <name>`");
        if (characterNameDB) return ErrorEmbed(message.channel, user, "a character with that name already exists!");
        if (Name.length > 18) return ErrorEmbed(message.channel, user, "your name is too long!");

        let creationFirst = new MessageEmbed()
                .setAuthor("Creation", user.displayAvatarURL({ dynamic: true }))
                .setColor([11, 61, 94])
                .setDescription(user.username + "'s character:"
                                + "\n\nName: `" + Name + "`"
                                + "\nGold: `300` <:gold:851858239284969473>"
                                + "\nTroops: `200` <:swordman:851863017389686804>"
                                + "\nAlliance: `None` <:shield:851859680786907166>"
                                + "\n\nYou just created your character, congratulations! You can explore more by using `" + prefix + "help`")
                .setFooter("This is a Beta version :)")
                //.setDescription("Cool your name will be **" + Name + "**, now choose the type of city hall\nYou can choose between these options\n\n`Japanese`, `British`, `Arabia`")

        message.channel.send(creationFirst)


        
        try {
            Character.create({ 
                        userId: uid,
                        name: Name,
                        gold: 300,
                        troops: 200,
                        health: 100,
                        alliance: "None",
                        potionEffect: "None",
                        wins: 0,
                        loss: 0,
                        matches: 0
                });
        } catch (err) {
            console.log(err);
            ErrorEmbed(message.channel, user, "there was an error while creating your character.")
        }

            

	},
};

