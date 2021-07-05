require('dotenv').config();
const fs = require('fs');
const { Client, Collection, MessageEmbed } = require('discord.js');
const client = new Client();
const mongoose = require('mongoose');
const config = require('./src/config.json');
const { ErrorEmbed } = require('./src/utils/utils');
const GuildSettings = require('./src/schemas/GuildSchema');

let DEBUG = false;
let last_cmds = new Map();

client.commands = new Collection();

const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./src/commands/${file}`);
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

mongoose
    .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true, 
    useCreateIndex: true,
    useFindAndModify: false
    })
    .then((m) => {
        console.log("Database connection established.");
    })
    .catch((err) => console.log(err));


client.login(process.env.DISCORD_BOT_TOKEN);

client.on("ready", () => {
    let users = 0;

    client.guilds.cache.forEach((guild)=>{
        users += guild.memberCount;
    })

    console.log("Kirito is ready!\nDebug State: " + (DEBUG ? "On" : "Off"))
    client.user.setActivity(`${users} users | k!help`, { type: "WATCHING" })
});

client.on("message", async (message) => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    
    let user = message.author;

    let prefix = config.prefix;
    let guild = message.guild;
    let guildDB = await GuildSettings.findOne({ guildId: guild.id });
    if (!guildDB) {
        await GuildSettings.create({
            guildId: guild.id,
            prefix: config.prefix
        })
    } else {
        prefix = guildDB.prefix;
    }

    if (!message.content.startsWith(prefix)) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
        let time = 3;
        if (user.id === '719306478804271155') time = 0;
        let last = last_cmds.get(user.id);
        let current = Date.now();
        let diff = Math.round((current-last)/1000);
      
        if (diff < time) {
            ErrorEmbed(message.channel, user, `you need to wait \`${time-diff}\` second(s) to execute another command!`) 
        } else {
		    client.commands.get(command).execute(client, message, args);
            last_cmds.set(user.id, current);
        }
	} catch (err) {
		console.error(err);
		message.reply('there was an error trying to execute that command!');
	}
});

client.on('guildCreate', async guild => {
    client.channels.cache.get('854452731490205726').send(`New server: **${guild.name}** (Owner: **${guild.owner.user.username}**) (Members: **${guild.memberCount}**)`);
    
    let msg = "Thank you for adding me to your server!"
    msg += "\nMy prefix is `" + config.prefix + "`, if you need help type `" + config.prefix + "help`"
    msg += "\nI am at your disposal!"
    
    
    let created = new MessageEmbed()
      .setAuthor(guild.name + " server!")
      .setDescription(msg)
      .setColor([11, 61, 94])
      .setThumbnail(guild.iconURL({ dynamic: true }))
    guild.channels.cache.filter(c => c.type === 'text').first().send(created);
  })


async function FindMessage(channelId, oponentChannelId, msgId, oponentMsgId, tag, oponentTag) {
    const { MessageEmbed } = require('discord.js');
    const Queue = require('./src/schemas/QueueSchema');
    const { GetQueueLength } = require('./src/utils/match_utils');
    let userMessage = new MessageEmbed()
        .setDescription(`:crossed_swords: **Match found!**\nYou are now fighting against: \`${oponentTag}\``)
        .setColor([0, 255, 0]);

    let oponentMessage = new MessageEmbed()
        .setDescription(`:crossed_swords: **Match found!**\nYou are now fighting against: \`${tag}\``)
        .setColor([0, 255, 0]);

    let queueLength = await GetQueueLength();
    await Queue.findOneAndUpdate({ _id: "60c24056227d8127b0cefb36" }, { size: queueLength-2 });

    client.channels.cache.get(channelId).messages.fetch(msgId).then(msg => msg.edit(userMessage));
    client.channels.cache.get(oponentChannelId).messages.fetch(oponentMsgId).then(msg => msg.edit(oponentMessage));
}

async function FindMessage2(winner, loser, winnerTag, loserTag, channelId, oponentChannelId, msgId, oponentMsgId) {
    const { MessageEmbed } = require('discord.js');
    const Character = require('./src/schemas/CharacterSchema');
    const Match = require('./src/schemas/MatchSchema');
    const winnerCharacter = await Character.findOne({ userId: winner });
    const loserCharacter = await Character.findOne({ userId: loser });
    let username = winnerCharacter.name;
    let userHealth = winnerCharacter.health;
    let userWins = winnerCharacter.wins;
    let userGold = winnerCharacter.gold;
    let userMatch = winnerCharacter.matches;
    let userEffect = winnerCharacter.potionEffect;

    let oponentEffect = loserCharacter.potionEffect
    let opHealth = loserCharacter.health;
    let opLoss = loserCharacter.loss;

    if (userHealth === 0) {
        userHealth = 0;
    } else {
        userHealth = userHealth-25;
    };

    if (opHealth === 0) {
        opHealth = 0;
    } else {
        opHealth = opHealth-50;
    };

    if (userEffect !== "None") {
        await Character.findOneAndUpdate({ userId: winner }, { potionEffect: "None" });
    } else if (oponentEffect !== "None") {
        await Character.findOneAndUpdate({ userId: loser }, { potionEffect: "None" });
    }
    
    await Character.findOneAndUpdate({ userId: winner }, { health: userHealth, wins: userWins+1, gold: userGold+50, matches: userMatch+1 });
    await Match.findOneAndDelete({ userId: winner });

    await Character.findOneAndUpdate({ userId: loser }, { health: opHealth, loss: opLoss+1, matches: userMatch+1 });
    await Match.findOneAndDelete({ userId: loser });

    let winnerMessage = new MessageEmbed()
        .setDescription(`:crossed_swords: **Match ended!**\n\nWinner: \`${username}\`\nLoser: \`${loserTag}\`\n\nThe winner received **50**<:gold:851858239284969473>`)
        .setColor([11, 61, 94]);    

    client.channels.cache.get(channelId).messages.fetch(msgId).then(msg => msg.edit(winnerMessage));
    client.channels.cache.get(oponentChannelId).messages.fetch(oponentMsgId).then(msg => msg.edit(winnerMessage));
}

module.exports = {
    FindMessage: FindMessage,
    FindMessage2: FindMessage2
}