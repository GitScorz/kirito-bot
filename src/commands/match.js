const { MessageEmbed } = require('discord.js');
const Character = require('../schemas/CharacterSchema');
const Match = require('../schemas/MatchSchema');
const Queue = require('../schemas/QueueSchema');
const { ErrorEmbed, GetGuildPrefix } = require('../utils/utils');
const { GetQueueLength, RemoveFromQueue, SearchMatch } = require('../utils/match_utils');

module.exports = {
	name: 'match',
	description: 'Fight with random people!',
	category: 'Game',
	async execute(client, message, args) {
		let user = message.author;

		const characterDB = await Character.findOne({ userId: user.id });
        if (!characterDB) return ErrorEmbed(message.channel, user, "to use this command you need to create a character!")
		let prefix = await GetGuildPrefix(message.guild.id)
		let queueLength = await GetQueueLength();

		if (args.length === 0) {
			let e = new MessageEmbed()
				.setAuthor("Matchmaking")
				.setDescription("There are `" + queueLength + "` users searching for a match!\n\nTo search for a match do `"+ prefix +"match find`\nIf you want to see your stats do `"+ prefix +"stats`")
				.setColor([11, 61, 94])
			message.channel.send(e);
		}

		if (args.length === 1) {
			if (args[0].toLowerCase() === "find") {
				if (characterDB.health <= 25) return ErrorEmbed(message.channel, user, "you have no health to fight!")
				let matchUserDB =  await Match.findOne({ userId: user.id });
				if (!matchUserDB /*|| !matchUserDB.inQueue || !matchUserDB.inMatch*/) {
					let e = new MessageEmbed()
						.setAuthor("Searching for a match 🔍")
						.setColor([11, 61, 94])
						.setFooter("Updates every 10 seconds")
						.setDescription("**You are searching for a match!**\n\nWithout you, there are `" + queueLength + "` users searching for a match.\nWait till you find one, this may take a while.")
					message.channel.send(e).then(async msg => {
						let time = Date.now() + (50 * 1000);
						let username = characterDB.name;

						await Queue.findOneAndUpdate({ _id: "60c24056227d8127b0cefb36" }, { size: queueLength+1 });

						await Match.create({
							startedSearching: time,
							inQueue: true,
							inMatch: false,
							name: username,
							userId: user.id,
							msgId: msg.id,
							channelId: message.channel.id
					 	});


						const searchUpdate = setInterval(async () => {
							let newMatchUserDB = await Match.findOne({ userId: user.id });

							if (newMatchUserDB === null) {
								return clearInterval(searchUpdate);
							} else {
								if (!newMatchUserDB.inMatch) {
									let startedSearching = newMatchUserDB.startedSearching;

									let timeExceeded = await Canceled(user.id, startedSearching);

									if (timeExceeded) {
										let a = new MessageEmbed()
											.setDescription("Time exceeded, match not found!")
											.setColor([255, 0, 0])
										msg.edit(a);
										clearInterval(searchUpdate);
										await RemoveFromQueue(user.id);
										return;
									}
								}
							}
							

							if (!newMatchUserDB.inMatch) {
								let newQueueLength = await GetQueueLength();
								let realUsers = newQueueLength-1

								if (realUsers > 0) {
									let nick = characterDB.name;
									await SearchMatch(user.id, nick, msg.id, message.channel.id);

									setTimeout(() => {
										if (newMatchUserDB.inMatch) clearInterval(searchUpdate);
									}, 7000)
									return;
								}

								let newMsg = new MessageEmbed()
									.setAuthor("Searching for a match 🔍")
									.setColor([11, 61, 94])
									.setDescription("**You are searching for a match!**\n\nWithout you, there are `" + realUsers + "` users searching for a match.\nWait till you find one, this may take a while.\n\nTo cancel do `"+ prefix +"match cancel`")
									.setFooter("Updates every 10 seconds")
								msg.edit(newMsg)

								return;
							}
						}, 10000);
					});
				} else {
					return ErrorEmbed(message.channel, user, "you are already searching for a match or already in one.")
				}
			}

			if (args[0].toLowerCase() === "cancel") {
				let matchUserDB =  await Match.findOne({ userId: user.id });
				if (!matchUserDB) return ErrorEmbed(message.channel, user, "you are not searching for a match!");
				if (matchUserDB.inMatch) return ErrorEmbed(message.channel, user, "you are not searching for a match!");
				await RemoveFromQueue(user.id);
				ErrorEmbed(message.channel, user, "you are no longer searching for a match!");
			}
		}
	},
};

async function Canceled(user, startedSearching) {

	let newMatchUserDB =  await Match.findOne({ userId: user });
	let now = Date.now();
	if (!newMatchUserDB || newMatchUserDB.inMatch) return true;
	
	if (startedSearching) {
		let restante = startedSearching-now;
		let falta = Math.floor(restante/1000);
		let min = 0;
		while (falta > 60) {
			falta -= 60;
			min++;
		}

		if (falta < 0 || min < 0) return true;
	}

	
	return false
}