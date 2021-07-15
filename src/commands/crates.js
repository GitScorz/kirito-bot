const { MessageEmbed } = require('discord.js');
const { ErrorEmbed, GetGuildPrefix } = require('../utils/utils');
const Character = require('../schemas/CharacterSchema');
const Inventory = require('../schemas/InventorySchema');
const { WoodCrateReward, StoneCrateReward, IronCrateReward, DiamondCrateReward } = require('../utils/chest_utils');

module.exports = {
	name: 'crates',
	description: 'Open crates!',
	category: 'Game',
	usage: 'open [crate]',
	async execute(client, message, args) {
		let user = message.author;

        const characterDB = await Character.findOne({ userId: user.id });
        if (!characterDB) return ErrorEmbed(message.channel, user, "to use this command you need to create a character!");

		let prefix = await GetGuildPrefix(message.guild.id)

		let wood = await Inventory.findOne({ userId: user.id, item: "woodcrate" });
		let stone = await Inventory.findOne({ userId: user.id, item: "stonecrate" });
		let iron = await Inventory.findOne({ userId: user.id, item: "ironcrate" });
		let diamond = await Inventory.findOne({ userId: user.id, item: "diamondcrate" });

		if (!wood) {
			wood = 0
		} else {
			wood = wood.amount
		}

		if (!stone) {
			stone = 0
		} else {
			stone = stone.amount
		}

		if (!iron) {
			iron = 0
		} else {
			iron = iron.amount
		}

		if (!diamond) {
			diamond = 0
		} else {
			diamond = diamond.amount
		}
		

		if (args.length === 0) {
			let msg = ":package: You have:\n";
			msg += "\n**Wood Crate** » `" + wood + "`";
			msg += "\n**Stone Crate** » `" + stone + "`";
			msg += "\n**Iron Crate** » `" + iron + "`";
			msg += "\n**Diamond** » `" + diamond + "`";
			
			msg += "\n\nIf you want to open crates: `" + prefix + "crates open`";
			msg += "\nOr if you want to buy some crates type `" + prefix + "shop`"
			
			let e = new MessageEmbed()
				.setAuthor(user.username + " Crates", user.displayAvatarURL({ dynamic: true }))
				.setDescription(msg)
				.setColor([11, 61, 94])
			
			message.channel.send(e)
		}


		if (args.length === 1) {
			if (args[0].toLowerCase() === "open") {
				let msg = "Select the crate you want open!\n";
				msg += "\nDo: `" + prefix + "crates open <crate_name>`";
				msg += "\n\nCrates to open:";
				if (wood > 0) msg += "\n**Wood Crates** » `" + wood + "`";
				if (stone > 0) msg += "\n**Stone Crates** » `" + stone + "`";
				if (iron > 0) msg += "\n**Iron Crates** » `" + iron + "`";
				if (diamond > 0) msg += "\n**Emerald Crates** » `" + diamond + "`";
				if (wood === 0 && stone === 0 && iron === 0 && diamond === 0) {
					msg += "\n`You have nothing to open!`"
				} else {
					msg += "\n\nExample: `" + prefix + "crates open diamond`";
				}
				
				let e = new MessageEmbed()
					.setAuthor("Crates Open", user.displayAvatarURL({ dynamic: true }))
					.setDescription(msg)
					.setColor([11, 61, 94])
					
				message.channel.send(e)
			}
		}


		if (args.length > 1) {
			if (args[0].toLowerCase() === "open") {
				if (args[1].toLowerCase() === "wood") {
					if (wood <= 0) {
						return ErrorEmbed(message.channel, user, "you don't have any __wood crates__ to open!")
					}
					let reward = await WoodCrateReward(user);
					let msg = "Wood crate opened sucessfully";
					msg += "\n\nInside the crate was:";
					msg += `\n»${reward}`
					
					let e = new MessageEmbed()
						.setAuthor("Wood Crate", user.displayAvatarURL({ dynamic: true }))
						.setDescription(msg)
						.setColor([0, 255, 0])
					
					message.channel.send(e)
					
					if (wood === 1) {
						await Inventory.findOneAndDelete({ userId: user.id, item: "woodcrate" })
					} else if (wood > 1) {
						await Inventory.findOneAndUpdate({ userId: user.id, item: "woodcrate" }, { amount: wood-1})
					}
					
				} else if (args[1].toLowerCase() === "stone") {
					if (stone <= 0) {
						return ErrorEmbed(message.channel, user, "you don't have any __stone crates__ to open")
					}
					let reward = await StoneCrateReward(user);
					let msg = "Stone crate opened sucessfully";
					msg += "\n\nInside the crate was:";
					msg += `\n\» **${reward}**`
					
					let e = new MessageEmbed()
						.setAuthor("Stone Crate", user.displayAvatarURL({ dynamic: true }))
						.setDescription(msg)
						.setColor([0, 255, 0])
					
					message.channel.send(e)
					
					if (stone === 1) {
						await Inventory.findOneAndDelete({ userId: user.id, item: "stonecrate" })
					} else if (stone > 1) {
						await Inventory.findOneAndUpdate({ userId: user.id, item: "stonecrate" }, { amount: stone-1})
					}
					
				} else if (args[1].toLowerCase() === "iron") {
					if (iron <= 0) {
						return ErrorEmbed(message.channel, user, "you don't have any __iron crates__ to open!")
					}
					let reward = await IronCrateReward(user);
					let msg = "Iron crate opened sucessfully";
					msg += "\n\nInside the crate was:";
					msg += `\n\» **${reward}**`
					
					let e = new MessageEmbed()
						.setAuthor("Iron Crate", user.displayAvatarURL({ dynamic: true }))
						.setDescription(msg)
						.setColor([0, 255, 0])
					
					message.channel.send(e)
					
					if (iron === 1) {
						await Inventory.findOneAndDelete({ userId: user.id, item: "ironcrate" })
					} else if (iron > 1) {
						await Inventory.findOneAndUpdate({ userId: user.id, item: "ironcrate" }, { amount: iron-1 })
					}
					
				} else if (args[1].toLowerCase() === "diamond") {
					
					if (diamond <= 0) {
						return ErrorEmbed(message.channel, user, "you don't have any __diamond crates__ to open!")
					}
					let reward = await DiamondCrateReward(user);
					let msg = "Diamond crate opened sucessfully";
					msg += "\n\nInside the crate was:";
					msg += `\n\» **${reward}**`
					
					let e = new MessageEmbed()
						.setAuthor("Diamond Crate", user.displayAvatarURL({ dynamic: true }))
						.setDescription(msg)
						.setColor([0, 255, 0])
					
					message.channel.send(e)
					
					if (diamond === 1) {
						await Inventory.findOneAndDelete({ userId: user.id, item: "diamondcrate" })
					} else if (diamond > 1) {
						await Inventory.findOneAndUpdate({ userId: user.id, item: "diamondcrate" }, { amount: diamond-1})
					}
						
				}
			} 
		}
	},
};