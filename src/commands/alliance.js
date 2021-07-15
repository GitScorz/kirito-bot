const { MessageEmbed } = require('discord.js');
const { ErrorEmbed, GetGuildPrefix } = require('../utils/utils');
const Alliance = require('../schemas/AllianceSchema');
const Character = require('../schemas/CharacterSchema');


// Criar sistema de ver os gajos da aliança (talvez checkar todos os gajos que tem aquela aliança nos charactersDB)
// Procurar aliança sei la fazer uma lista?
// Pagar para criar uma aliança
// Criar sistema para meter o minimo de batalhas ganhas e colocar privado ou publico..
// Se ele tiver numa aliança nao pode criar ou entrar noutras


module.exports = {
	name: 'alliance',
	description: 'Join or create a new alliance and dominate!',
	category: 'Game',
	usage: 'create/join/list',
	async execute(client, message, args) {
        let user = message.author;

        const characterDB = await Character.findOne({ userId: user.id });
        if (!characterDB) return ErrorEmbed(message.channel, user, "to use this command you need to create a character!");

		let prefix = await GetGuildPrefix(message.guild.id)

		if (args.length === 0) {
			if (characterDB.alliance === "None") {
				let e = new MessageEmbed()
					.setAuthor("Alliances", user.displayAvatarURL({ dynamic: true }))
					.setDescription(`Hey **${user.username}** you don't have an alliance join one with \`${prefix}alliance join <name>\`\n\nTo see the alliances you can use \`${prefix}alliance list\`\nIf you feel you don't like the other alliances do \`${prefix}alliance create\``)
					.setColor([11, 61, 94])

				message.channel.send(e)
			}
		}

		if (args.length > 0) {
			if (args[0].toLowerCase() === "create") {
				if (characterDB.alliance !== "None") return ErrorEmbed(message.channel, user, "you can't do this while in one alliance!");
				args.shift();
				let name = args.join(' ');
				let gold = characterDB.gold;
				if (!name) return ErrorEmbed(message.channel, user, "please put a name!");
				if (name.length > 18) return ErrorEmbed(message.channel, user, "the name of alliance is too long!");
				const allianceNameDB = await Alliance.findOne({ name: name });
				if (allianceNameDB) return ErrorEmbed(message.channel, user, "a alliance with that name already exists!");
				if (gold < 500) return ErrorEmbed(message.channel, user, "you don't have sufficient gold (500)");

				let e = new MessageEmbed()
					.setAuthor("Alliance created!")
					.setColor([11, 61, 94])
					.setDescription(`Name: \`${name}\``
									+ "\nUsers: `1/10`"
									+ "\nState: `Public` <:yes:852118537757392897>"
									+ "\nMinimum Wins: `0`"
									+ "\n\nIf you want to get an overview and customize your alliance do `" + prefix + "alliance overview`")

				message.channel.send(e)

				await Alliance.create({
					minimumWins: 0,
					state: "Public",
					name: name,
					users: 1,
					owner: user.id,
					createdAt: Date.now()
				})

				await Character.findOneAndUpdate({ userId: user.id }, { alliance: name, gold: gold-500 });
			}

			if (args[0].toLowerCase() === "join") {
				if (characterDB.alliance !== "None") return ErrorEmbed(message.channel, user, "you can't do this while in one alliance!");
				args.shift();
				let allianceJoin = args.join(' ');
				let alliances = await Alliance.find({})
				for (let i = 0; i < alliances.length; i++) {
					if (alliances[i].name === allianceJoin) {
						let wins = characterDB.wins;
						let allianceUsers = alliances[i].users;
						let allianceState = alliances[i].state;
						let allianceMinimum = alliances[i].minimumWins;

						if (allianceState === "Private") return ErrorEmbed(message.channel, user, "that alliance is private!");
						if (allianceUsers === 10) return ErrorEmbed(message.channel, user, "that alliance is full!");
						if (allianceMinimum > wins) return ErrorEmbed(message.channel, user, "you need " + allianceMinimum + " minimum wins to join this alliance!");

						await Character.findOneAndUpdate({ userId: user.id }, { alliance: allianceJoin });
						await Alliance.findOneAndUpdate({ name: allianceJoin }, { users: allianceUsers+1 })
						let e = new MessageEmbed()
							.setDescription("You joined the alliance **" + allianceJoin + "**, to get an overview of that alliance do `" + prefix + "alliance overview`")
							.setColor([0, 255, 0])
						message.channel.send(e);
						break;
					} else {
						return ErrorEmbed(message.channel, user, "that alliance doesn't exists!");
					}
				}
			}

			if (args[0].toLowerCase() === "leave") {
				if (characterDB.alliance === "None") return ErrorEmbed(message.channel, user, "you are not in one alliance!");
				let alliance = characterDB.alliance;
				let allianceOverview = await Alliance.findOne({ name: alliance });

				if (allianceOverview.owner === user.id) return ErrorEmbed(message.channel, user, "you are the owner, you can delete if you want!");
				let allianceUsers = allianceOverview.users;

				let e = new MessageEmbed()
					.setDescription("You just leaved your alliance!")
					.setColor([255, 0, 0])
				message.channel.send(e)

				await Character.findOneAndUpdate({ userId: user.id }, { alliance: "None" });
				await Alliance.findOneAndUpdate({ name: alliance }, { users: allianceUsers-1 })
			}

			if (args[0].toLowerCase() === "overview") {
				if (characterDB.alliance === "None") return ErrorEmbed(message.channel, user, "you are not in one alliance!");
				let alliance = characterDB.alliance;
				let allianceOverview = await Alliance.findOne({ name: alliance });
				let ownerId = allianceOverview.owner;
				let users = allianceOverview.users;
				let state = allianceOverview.state;
				let minimumWins = allianceOverview.minimumWins;
				let name = allianceOverview.name;

				let characters = await Character.find({})

				let msg = `Name: \`${name}\`` 

				for (let i = 0; i < characters.length; i++) {
					if (characters[i].userId === ownerId) {
						var owner = characters[i].name;
						break;
					}
				}
				msg += `\nOwner: \`${owner}\` :crown:`
				msg += `\nUsers: \`${users}/10\``
				if (state == "Public") {
					msg += `\nState: \`${state}\` <:yes:852118537757392897>`;
				} else {
					msg += `\nState: \`${state}\` <:nop:852118537735634965>`;
				}
				msg += `\nMinimum Wins: \`${minimumWins}\` :crossed_swords:`

				msg += `\n\nSee the list of users with \`${prefix}alliance users\``

				if (allianceOverview.owner === user.id) {
					msg += "\nIf you want to change any setting do `" + prefix + "alliance settings <setting_name> <value>`\nNote: To change the value of minimum wins use the setting_name `wins`!";
				}

				let e = new MessageEmbed()
					.setAuthor(alliance + " Overview")
					.setColor([11, 61, 94])
					.setDescription(msg)
				message.channel.send(e)
			}

			if (args[0].toLowerCase() === "users") {
				if (characterDB.alliance === "None") return ErrorEmbed(message.channel, user, "you are not in one alliance!");
				let alliance = characterDB.alliance;
				let allianceData = await Alliance.findOne({ name: alliance });
				let characters = await Character.find({});
				var users = [];
				var owner;
				for (let i = 0; i < characters.length; i++) {
					if (characters[i].alliance === alliance) {
						let username = characters[i].name;
						if (allianceData.owner === characters[i].userId) {
							owner = characters[i].name
						}
						users.push(username);
					}
				}

				
				let msg = "";
				for (let i = 0; i < users.length; i++) {
					if (owner === users[i]) {
						msg += `\`${users[i]}\` :crown:\n`
					} else {
						msg += `\`${users[i]}\`\n`
					}
				}

				let e = new MessageEmbed()
					.setAuthor(`${alliance} Users`)
					.setDescription(msg)
					.setColor([11, 61, 94])
				message.channel.send(e);

			}

			if (args[0].toLowerCase() === "settings") {
				if (characterDB.alliance === "None") return ErrorEmbed(message.channel, user, "you are not in one alliance!");
				let alliance = characterDB.alliance;
				let allianceOverview = await Alliance.findOne({ name: alliance });
				if (allianceOverview.owner !== user.id) return ErrorEmbed(message.channel, user, "you are not the owner of the alliance!");

				if (!args[1]) return ErrorEmbed(message.channel, user, "you can change the `wins` and `state` settings!");

				if (args[1].toLowerCase() === "state") {
					let newState = args[2];
					if (!newState) return ErrorEmbed(message.channel, user, "please put any value!");
					if (newState !== "Public" && newState !== "Private") return ErrorEmbed(message.channel, user, "use the values `Public` and `Private`!");
					if (newState === allianceOverview.state) return ErrorEmbed(message.channel, user, "the state is already " + newState + "!");
					let e = new MessageEmbed()
						.setDescription("You changed the state to `" + newState + "`.")
						.setColor([0, 255, 0])
					message.channel.send(e);
					await Alliance.findOneAndUpdate({ name: alliance }, { state: newState });
				}
				
				if (args[1].toLowerCase() === "wins") {
					let newWins = args[2];
					if (!newWins) return ErrorEmbed(message.channel, user, "please put any value!");
					if (isNaN(newWins)) return ErrorEmbed(message.channel, user, "the value is not a number!");
					if (newWins > 100) return ErrorEmbed(message.channel, user, "that value is too high, maybe later..");
					if (allianceOverview.minimumWins === newWins) return ErrorEmbed(message.channel, user, "that value is the same that alliance have!");
					let e = new MessageEmbed()
						.setDescription("You changed the minimum wins to `" + newWins + "`.")
						.setColor([0, 255, 0])
					message.channel.send(e);
					await Alliance.findOneAndUpdate({ name: alliance }, { minimumWins: newWins });
				}
			}

			if (args[0].toLowerCase() === "list") {
				let page = 1;
  
				const m = await message.channel.send("Getting alliances...");
				
				let is = true;
				p(message, m, client, is, page);
			}
		}

		async function p(message, m, client, is, page) {
			let roles = message.guild.roles.array();
			console.log(roles)
		}
	},
};

