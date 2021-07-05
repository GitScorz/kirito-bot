const { MessageEmbed } = require('discord.js');
const Character = require('../schemas/CharacterSchema');
const Inventory = require('../schemas/InventorySchema');
const { ErrorEmbed, GetDisplayName } = require('../utils/utils');
const Shop = require('../utils/items_list');

module.exports = {
	name: 'shop',
	description: 'You can buy things here!',
    category: 'Game',
	async execute(client, message, args) {
        let user = message.author;
        var category = 0;
        var items = {};
        var prices = {};
        var selectedItem = {};
        var selectedPrice = {};

        const characterDB = await Character.findOne({ userId: user.id });
        if (!characterDB) return ErrorEmbed(message.channel, user, "to use this command you need to create a character!");

        const gold = characterDB.gold

        if (args.length === 0)  {
            let e = new MessageEmbed()
                .setAuthor("Shop")
                .setDescription("To navigate through the menu you should react to emojis!")
                .addField("1) Potions", "You can buy a bunch of potions here.", false)
                .addField("2) Items", "You can buy some items such as a armory or even a fishing rod.", false)
                .addField("3) Crates", "Crates is a great option to evolve.", false)
                .setColor([11, 61, 94])
                .setThumbnail("https://i.imgur.com/KsOCJyh.png")
            message.channel.send(e).then(async msg => {
                await msg.react("1️⃣");
                await msg.react("2️⃣");
                await msg.react("3️⃣");
                await msg.react("4️⃣");
                await msg.react("5️⃣");
                await msg.react("6️⃣");
                await msg.react("⏪");
                await msg.react("852118537757392897");
                await msg.react("852118537735634965");

                const oneFilter = (reaction, user) => reaction.emoji.name === '1️⃣' && user.id === message.author.id;
                const twoFilter = (reaction, user) => reaction.emoji.name === '2️⃣' && user.id === message.author.id;
                const threeFilter = (reaction, user) => reaction.emoji.name === '3️⃣' && user.id === message.author.id;
                const fourFilter = (reaction, user) => reaction.emoji.name === '4️⃣' && user.id === message.author.id;
                const fiveFilter = (reaction, user) => reaction.emoji.name === '5️⃣' && user.id === message.author.id;
                const sixFilter = (reaction, user) => reaction.emoji.name === '6️⃣' && user.id === message.author.id;
                const backFilter = (reaction, user) => reaction.emoji.name === '⏪' && user.id === message.author.id;
                const yesFilter = (reaction, user) => reaction.emoji.id === '852118537757392897' && user.id === message.author.id;
                const nopFilter = (reaction, user) => reaction.emoji.id === '852118537735634965' && user.id === message.author.id;

                const potions = msg.createReactionCollector(oneFilter, { time: 60000 });
                const itemshop = msg.createReactionCollector(twoFilter, { time: 60000 });
                const crates = msg.createReactionCollector(threeFilter, { time: 60000 });
                const four = msg.createReactionCollector(fourFilter, { time: 60000 });
                const five = msg.createReactionCollector(fiveFilter, { time: 60000 });
                const six = msg.createReactionCollector(sixFilter, { time: 60000 });
                const back = msg.createReactionCollector(backFilter, { time: 60000 });
                const yes = msg.createReactionCollector(yesFilter, { time: 60000 });
                const nop = msg.createReactionCollector(nopFilter, { time: 60000 });

                potions.on('collect', async () => {
                    let i = 0
                    if (category === 0) {
                        category = 1
                        items = {}
                        prices = {}
                        let potione = new MessageEmbed().setAuthor("Potions").setColor([11, 61, 94]);
                        let potionShop = Shop.potions

                        Object.keys(potionShop).forEach(function (key) {
                            i++
                            items[i] = key
                            prices[i] = potionShop[key].price
                            potione.addField(`${i} - ${potionShop[key].displayName}`, `${potionShop[key].description} (${potionShop[key].price} <:gold:851858239284969473>)`, false)
                        });
                        
                        msg.edit(potione);
                    } else {
                        if (category === 10) return;

                        const toBuy = items[1];
                        const price = prices[1];
                        selectedItem = items[1];
                        selectedPrice = prices[1];

                        if (toBuy === undefined) return;

                        if (price > gold) {
                            let cantAfford = new MessageEmbed()
                                .setColor([255, 0, 0])
                                .setDescription(`You need more ${price - gold} <:gold:851858239284969473> to buy that!`)
                            msg.edit(cantAfford)
                            return;
                        }


                        let canAfford = new MessageEmbed()
                            .setColor([11, 61, 94])
                            .setDescription(`Are you sure you want to buy this item for ${price}<:gold:851858239284969473>?`)
                        msg.edit(canAfford)
                        category = 10
                    }
                });

                itemshop.on('collect', async () => {
                    let i = 0
                    if (category === 0) {
                        category = 2
                        items = {}
                        prices = {}
                        let itemse = new MessageEmbed().setAuthor("Items").setColor([11, 61, 94]);
                        let itemShop = Shop.items

                        Object.keys(itemShop).forEach(function (key) {
                            i++
                            items[i] = key
                            prices[i] = itemShop[key].price
                            itemse.addField(`${i} - ${itemShop[key].displayName}`, `${itemShop[key].description} (${itemShop[key].price} <:gold:851858239284969473>)`, false)
                        });
                        
                        msg.edit(itemse);
                    } else {
                        if (category === 10) return;

                        const toBuy = items[2];
                        const price = prices[2];
                        selectedItem = items[2];
                        selectedPrice = prices[2];

                        if (toBuy === undefined) return;

                        if (price > gold) {
                            let cantAfford = new MessageEmbed()
                                .setColor([255, 0, 0])
                                .setDescription(`You need more ${price - gold} <:gold:851858239284969473> to buy that!`)
                            msg.edit(cantAfford)
                            return;
                        }

                        let canAfford = new MessageEmbed()
                            .setColor([11, 61, 94])
                            .setDescription(`Are you sure you want to buy this item for ${price}<:gold:851858239284969473>?`)
                        msg.edit(canAfford)
                        category = 10
                    }
                });

                crates.on('collect', async () => {
                    let i = 0
                    if (category === 0) {
                        category = 3
                        items = {}
                        prices = {}
                        let cratese = new MessageEmbed().setAuthor("Crates").setColor([11, 61, 94]);
                        let cratesShop = Shop.crates

                        Object.keys(cratesShop).forEach(function (key) {
                            i++
                            items[i] = key
                            prices[i] = cratesShop[key].price
                            cratese.addField(`${i} - ${cratesShop[key].displayName}`, `${cratesShop[key].description} (${cratesShop[key].price} <:gold:851858239284969473>)`, false)
                        });
                        
                        msg.edit(cratese);
                    } else {

                        if (category === 10) return;

                        const toBuy = items[3];
                        const price = prices[3];
                        selectedItem = items[3];
                        selectedPrice = prices[3];

                        if (toBuy === undefined) return;

                        if (price > gold) {
                            let cantAfford = new MessageEmbed()
                                .setColor([255, 0, 0])
                                .setDescription(`You need more ${price - gold} <:gold:851858239284969473> to buy that!`)
                            msg.edit(cantAfford)
                            return;
                        }

                        let canAfford = new MessageEmbed()
                            .setColor([11, 61, 94])
                            .setDescription(`Are you sure you want to buy this item for ${price}<:gold:851858239284969473>?`)
                        msg.edit(canAfford)
                        category = 10
                    }
                });

                four.on('collect', async () => {
                    if (category === 0) return;
                    if (category === 10) return;
                    category = 4

                    const toBuy = items[4];
                    const price = prices[4];
                    selectedItem = items[4];
                    selectedPrice = prices[4];
            

                    if (toBuy === undefined) return;


                    if (price > gold) {
                        let cantAfford = new MessageEmbed()
                            .setColor([255, 0, 0])
                            .setDescription(`You need more ${price - gold} <:gold:851858239284969473> to buy that!`)
                        msg.edit(cantAfford)
                        return;
                    }

                    let canAfford = new MessageEmbed()
                        .setColor([11, 61, 94])
                        .setDescription(`Are you sure you want to buy this item for ${price}<:gold:851858239284969473>?`)
                    msg.edit(canAfford)
                    category = 10
                });

                five.on('collect', async () => {
                    if (category === 0) return;
                    if (category === 10) return;
                    category = 5

                    const toBuy = items[5];
                    const price = prices[5];
                    selectedItem = items[5];
                    selectedPrice = prices[5];

                    if (toBuy === undefined) return;

                    if (price > gold) {
                        let cantAfford = new MessageEmbed()
                            .setColor([255, 0, 0])
                            .setDescription(`You need more ${price - gold} <:gold:851858239284969473> to buy that!`)
                        msg.edit(cantAfford)
                        return;
                    }

                    let canAfford = new MessageEmbed()
                        .setColor([11, 61, 94])
                        .setDescription(`Are you sure you want to buy this item for ${price}<:gold:851858239284969473>?`)
                    msg.edit(canAfford)
                    category = 10
                });

                six.on('collect', async () => {
                    if (category === 0) return;
                    if (category === 10) return;
                    category = 6

                    const toBuy = items[6];
                    const price = prices[6];
                    selectedItem = items[6];
                    selectedPrice = prices[6];

                    if (toBuy === undefined) return;

                    if (price > gold) {
                        let cantAfford = new MessageEmbed()
                            .setColor([255, 0, 0])
                            .setDescription(`You need more ${price - gold} <:gold:851858239284969473> to buy that!`)
                        msg.edit(cantAfford)
                        return;
                    }


                    let canAfford = new MessageEmbed()
                        .setColor([11, 61, 94])
                        .setDescription(`Are you sure you want to buy this item for ${price}<:gold:851858239284969473>?`)
                    msg.edit(canAfford)
                    category = 10
                    
                });

                back.on('collect', async () => {
                    if (category === 0) return;
                    category = 0

                    items = {}
                    prices = {}
                    selectedItem = {};
                    selectedPrice = {};

                    let backe = new MessageEmbed()
                        .setAuthor("Shop")
                        .setDescription("To navigate through the menu you should react to emojis!")
                        .addField("1) Potions", "You can buy a bunch of potions here.", false)
                        .addField("2) Items", "You can buy some items such as a armory or even a fishstick.", false)
                        .addField("3) Crates", "Crates is a great option to evolve.", false)
                        .setColor([11, 61, 94])
                        .setThumbnail("https://i.imgur.com/KsOCJyh.png")
                    msg.edit(backe);
                });

                yes.on('collect', async () => {
                    if (category !== 10) return;
                    
                    let toBuy = selectedItem;
                    let price = selectedPrice;

                    if (Object.keys(toBuy).length === 0) return;

                    let displayName = GetDisplayName(toBuy);
                    let pay = gold - price
                    
                    let bought = new MessageEmbed()
                        .setDescription(`You just bought a **${displayName}** for **${price}**<:gold:851858239284969473>!`)
                        .setColor([0, 255, 0])
                    msg.edit(bought);

                    await Character.findOneAndUpdate({ userId: user.id }, { gold: pay });

                    let hasItem = await Inventory.findOne({ userId: user.id, item: toBuy });

                    if (!hasItem) {
                        await Inventory.create({
                            item: toBuy,
                            amount: 1,
                            userId: user.id
                        });
                    } else {
                        let amount = hasItem.amount;
                        await Inventory.findOneAndUpdate({ userId: user.id, item: toBuy }, { amount: amount+1 });
                    }


                    category = 11;
                    items = {};
                    prices = {};
                    selectedItem = {};
                    selectedPrice = {};

                });

                nop.on('collect', async () => {
                    if (category !== 10) return;
                    
                    const toBuy = selectedItem;

                    if (Object.keys(toBuy).length === 0) return;

                    category = 0;
                    items = {};
                    prices = {};
                    selectedItem = {};
                    selectedPrice = {};

                    let backe = new MessageEmbed()
                        .setAuthor("Shop")
                        .setDescription("To navigate through the menu you should react to emojis!")
                        .addField("1) Potions", "You can buy a bunch of potions here.", false)
                        .addField("2) Items", "You can buy some items such as a armory or even a fishstick.", false)
                        .addField("3) Crates", "Crates is a great option to evolve.", false)
                        .setColor([11, 61, 94])
                        .setThumbnail("https://i.imgur.com/KsOCJyh.png")
                    msg.edit(backe);
                });
            });
        } 

	},
};
