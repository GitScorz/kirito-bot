const { MessageEmbed, Message } = require('discord.js');
const Character = require('../schemas/CharacterSchema');
const Inventory = require('../schemas/InventorySchema');
const { ErrorEmbed, GetDisplayName, IsValidItem, GetGuildPrefix } = require('../utils/utils');

module.exports = {
	name: 'inventory',
	description: 'In inventory you can see the items that you have and use them!',
	category: 'Game',
	async execute(client, message, args) {
        let user = message.author;
		var itemId = {};
		var itemAmount = {};

        const characterDB = await Character.findOne({ userId: user.id });
		const inventoryDB = await Inventory.findOne({ userId: user.id });
        if (!characterDB) return ErrorEmbed(message.channel, user, "to use this command you need to create a character!");
		
		let prefix = await GetGuildPrefix(message.guild.id)

		if (args.length === 0) {
			if (!inventoryDB) {
				let a = new MessageEmbed()
					.setAuthor(`${user.username} Inventory`, user.displayAvatarURL({ dynamic: true }))
					.setDescription("You don't have any items on your inventory, buy some with `" + prefix + "shop`.")
					.setColor([11, 61, 94])
				return message.channel.send(a);
			}

			const items = await Inventory.find({ userId: message.author.id }, null);
			
			let e = new MessageEmbed()
				.setAuthor(`${user.username} Inventory`, user.displayAvatarURL({ dynamic: true }))
				.setColor([11, 61, 94])

			Object.keys(items).forEach(function (key) {
				itemId[key] = items[key].item;
				itemAmount[key] = items[key].amount;
			});

			let displayName;
			let msg = "";
			let invInfo = "";
			let itemsLength = Object.keys(items).length;

			for (let i = 0; i < itemsLength; i++) {
				displayName = GetDisplayName(itemId[i]);
				msg +=  `» \`${displayName}\` (${itemAmount[i]})\n`;

				if (itemId[i] == "boots") {
					invInfo += `\nYou are you using your **boots**!`
				}

				if (itemId[i] == "chestplate") {
					invInfo += `\nYou are you using your **chestplate**!`
				}
		
				if (itemId[i] == "helmet") {
					invInfo += `\nYou are you using your **helmet**!`
				}
		
				if (items[i] == "leggings") {
					invInfo += `\nYou are you using your **leggings**!`
				}
			}


			if (characterDB.potionEffect !== "None") {
				invInfo += `\nYou are with **${characterDB.potionEffect}** effect!`
			}

			e.setDescription("This is your inventory!\nIf you have crates you can start opening by using `" + prefix + "crates`\nIf you want to use some item do `" + prefix + "inventory use <item_name>`\n\n" + msg + invInfo)
			message.channel.send(e)
		}

		if (args.length > 0) {
			if (args[0].toLowerCase() === "use") {
				let remove = false
				let smth = args.shift()
				let used = args.join(' ').toLowerCase().split(" ").join("");
				if (!used) return ErrorEmbed(message.channel, user, "you need to provide an item!");
				if (!IsValidItem(used)) return ErrorEmbed(message.channel, user, "that item doesn't exists!");
				const items = await Inventory.find({ userId: message.author.id }, null);

				let hasItem = false
				for (let i = 0; i < items.length; i++) {
					if (items[i].item === used) {
						if (items[i].amount > 0) {
							hasItem = true
							break;
						}
					}
				}

				if (!hasItem) return ErrorEmbed(message.channel, user, "you don't have that item!");

				if (used == "healpotion") {
					if (characterDB.health === 100) return ErrorEmbed(message.channel, user, "you already have **100**<:life_hp:853288570113359872>");
					let newHealth = characterDB.health+25
					await Character.findOneAndUpdate({ userId: user.id }, { health: newHealth });
					let e = new MessageEmbed().setDescription("You just used a **Heal Potion**.\nNow you have `" + newHealth + "`<:life_hp:853288570113359872>").setColor([0, 255, 0])
					message.channel.send(e);
					remove = true;
				} else if (used == "agilitypotion") {
					await Character.findOneAndUpdate({ userId: user.id }, { potionEffect: "Agility" });
					let e = new MessageEmbed().setDescription("You just used a **Agility Potion**.").setColor([0, 255, 0])
					message.channel.send(e);
					remove = true;
				} else if (used == "strengthpotion") {
					await Character.findOneAndUpdate({ userId: user.id }, { potionEffect: "Strength" });
					let e = new MessageEmbed().setDescription("You just used a **Strength Potion**.").setColor([0, 255, 0])
					message.channel.send(e);
					remove = true;
				} else {
					ErrorEmbed(message.channel, user, "that item is unusable!");
				}


				if (remove) {
					for (let i = 0; i < items.length; i++) {
						if (items[i].item === used) {
							if (items[i].amount > 1) {
								let newAm = items[i].amount-1
								await Inventory.findOneAndUpdate({ userId: user.id, item: used }, { amount: newAm })
							} else {
								await Inventory.findOneAndDelete({ userId: user.id, item: used })
							}

							break;
						}
					}
				}

			}
		}
	
	},
};