const { MessageEmbed } = require('discord.js');
const Character = require('../schemas/CharacterSchema');
const Train = require('../schemas/TrainSchema');
const { ErrorEmbed, GetGuildPrefix } = require('../utils/utils');

module.exports = {
	name: 'train',
	description: 'You can train troops here!',
	category: 'Game',
	async execute(client, message, args) {
		let user = message.author;

        const characterDB = await Character.findOne({ userId: user.id });
		const train = await Train.findOne({ userId: user.id });
		if (!characterDB) return ErrorEmbed(message.channel, user, "to use this command you need to create a character!");
		let prefix = await GetGuildPrefix(message.guild.id)

		if (args.length === 0) {
			if (train) {
				let currentlyTraining = train.currentlyTraining;
				let start = train.trainStart;
				let trainingTroops = train.troops;
				let now = Date.now();

				if (currentlyTraining) {
					let restante = start-now;
					let falta = Math.floor(restante/1000);

					let min = 0;
					while (falta > 60) {
						falta -= 60;
						min++;
					}

					let state;
					if (falta > 0 || min > 0) state = "In progress"
					if (falta <= 0) state = "Finished"
					
					let e = new MessageEmbed()
						.setAuthor("Training Area", user.displayAvatarURL())
						.setDescription("In the training area you can train your troops and get more troops, how?"
										+ "\nWell just do `" + prefix + "train start` or to collect your troops `" + prefix + "train collect`."
										+ "\n\nYou are currently training `" + trainingTroops + "`<:swordman:851863017389686804>\nState: `" + state + "`")
						.setColor([11, 61, 94])
					message.channel.send(e)
				}
			} else {
				let e = new MessageEmbed()
					.setAuthor("Training Area", user.displayAvatarURL())
					.setDescription("In the training area you can train your troops and get more troops, how?"
									+ "\nWell just do `" + prefix + "train start` or to collect your troops `" + prefix + "train collect`.")
					.setColor([11, 61, 94])
				message.channel.send(e)
			}
		}

		if (args.length > 0) {
			if (args[0].toLowerCase() === "start") {

				let troopsToTrain = args[1];
				let troops = characterDB.troops;
				let now = Date.now();
				
				if (!troopsToTrain) return ErrorEmbed(message.channel, user, "you need to put the amount of troops you want to train like `" + prefix + "train start <max||amount_troops>`");
				if (troopsToTrain == "max") {
					if (train) {
						let currentlyTraining = train.currentlyTraining
						if (currentlyTraining) return ErrorEmbed(message.channel, user, "you are already training troops!");
					}

					let total = Date.now() + (troops * 1000);

					await Train.create({
						troops: troops,
						trainStart: total,
						currentlyTraining: true,
						userId: user.id
					});

					let e = new MessageEmbed()
						.setDescription(`Your troops just started training: \`${troops}\`<:swordman:851863017389686804>`)
						.setColor([11, 61, 94])
					message.channel.send(e)
					
				} else {
					if (train) {
						let currentlyTraining = train.currentlyTraining
						if (currentlyTraining) return ErrorEmbed(message.channel, user, "you are already training troops!");
					}
					if (isNaN(troopsToTrain)) return ErrorEmbed(message.channel, user, "the troops value must be a number!");
					if (troopsToTrain > troops) return ErrorEmbed(message.channel, user, "you don't have that amount of troops!");

					let total = Date.now() + (troopsToTrain * 1000);

					await Train.create({
						troops: troopsToTrain,
						trainStart: total,
						currentlyTraining: true,
						userId: user.id
					});

					let e = new MessageEmbed()
						.setDescription(`Your troops just started training: \`${troopsToTrain}\`<:swordman:851863017389686804>`)
						.setColor([11, 61, 94])
					message.channel.send(e)
				}
			}

			if (args[0].toLowerCase() === "collect") {
				if (train) {
					let start = train.trainStart;
					let troops = train.troops;
					let now = Date.now();
					let restante = start-now;
					let falta = Math.floor(restante/1000);

					let min = 0;
					while (falta > 60) {
						falta -= 60;
						min++;
					}
					
					let state = "";
					let sstate = "";
					if (falta > 0 || min > 0) state = "In progress";
					if (falta < 0) sstate = "Finished";

					if (state == "In progress") {
						ErrorEmbed(message.channel, user, "you can't collect yet. Time left: `" + min + "m:" + falta + "s`")
					} else if (sstate == "Finished") {
						let amount = Math.floor((Math.random() * 100) + 20);  
						let e = new MessageEmbed()
							.setDescription("You sucessfully collected `" + amount + "`<:swordman:851863017389686804>")
							.setColor([11, 61, 94])
						message.channel.send(e)

						await Character.findOneAndUpdate({ userId: user.id }, { troops: troops+amount });
						await Train.findOneAndDelete({ userId: user.id });
					}
				} else {
					ErrorEmbed(message.channel, user, "you are not training troops!")
				}
			}
		}

	},
};