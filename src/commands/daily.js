const { MessageEmbed } = require('discord.js');
const Character = require('../schemas/CharacterSchema');
const Daily = require('../schemas/DailySchema');
const { ErrorEmbed, parseMS } = require('../utils/utils');

module.exports = {
	name: 'daily',
	description: 'Collect your daily reward!',
    category: 'Game',
	async execute(client, message, args) {
        let user = message.author;

        const characterDB = await Character.findOne({ userId: user.id });
        if (!characterDB) return ErrorEmbed(message.channel, user, "to use this command you need to create a character!");

        let cooldown = 8.64e+7;
        let health = characterDB.health;
        let gold = characterDB.gold;
        let hasClaimedOnce = false;
        let now = Date.now();

        let dailyDB = await Daily.findOne({ userId: user.id });
        if (dailyDB) hasClaimedOnce = true


        if (!hasClaimedOnce) {
            let randomGold = Math.floor(Math.random() * 100) + 25;
            let healthReward = 25
            if (health === 100) healthReward = 0;

            let msg = "You claimed your daily reward!"
            msg += `\n\n» **+${randomGold}**<:gold:851858239284969473>`

            if (healthReward === 25) {
                msg += "\n» **+25**<:life_hp:853288570113359872>"
            }


            let e = new MessageEmbed()
                .setAuthor(`Daily Reward`)
                .setDescription(msg)
                .setColor([11, 61, 94])

            message.channel.send(e)


            await Character.findOneAndUpdate({ userId: user.id }, { gold: gold+randomGold, health: healthReward })

            try {
                await Daily.create({
                    lastDaily: now,
                    userId: user.id
                })
            } catch (err) {
                console.log(err)
            }

        } else {
            let lastDaily = dailyDB.lastDaily
            if (cooldown - (now - lastDaily) > 0) {
                let timeObj = parseMS(cooldown - (now - lastDaily))
                let e = new MessageEmbed()
                    .setAuthor(`Daily Reward`)
                    .setColor([255, 0, 0])
                    .setDescription(`You already claimed the daily reward!\nYou can claim again in \`${timeObj.hours}h:${timeObj.minutes}m\`!`)
                message.channel.send(e)
            } else {
                let randomGold = Math.floor(Math.random() * 100) + 25;
                let healthReward = 25
                if (health === 100) healthReward = 0;
    
                let msg = "You claimed your daily reward!"
                msg += `\n\n» **+${randomGold}**<:gold:851858239284969473>`
    
                if (healthReward === 25) {
                    msg += "\n» **+25**<:life_hp:853288570113359872>"
                } 
    
                let e = new MessageEmbed()
                    .setAuthor(`Daily Reward`)
                    .setDescription(msg)
                    .setColor([11, 61, 94])
    
                message.channel.send(e)
    
                await Character.findOneAndUpdate({ userId: user.id }, { gold: gold+randomGold, health: healthReward })
                await Daily.findOneAndUpdate({ userId: user.id }, { lastDaily: now })
            }


        }

	},
};

