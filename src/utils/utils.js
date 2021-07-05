function ErrorEmbed(channel, user, msg) {
    const { MessageEmbed, Message } = require('discord.js');
    let e = new MessageEmbed().setDescription("**" + user.username + "**, " + msg).setColor([255, 0, 0])    
    channel.send(e)
}

function parseMS(milliseconds) {
    if (typeof milliseconds !== 'number') {
		throw new TypeError('Expected a number');
	}

	const roundTowardsZero = milliseconds > 0 ? Math.floor : Math.ceil;

	return {
		days: roundTowardsZero(milliseconds / 86400000),
		hours: roundTowardsZero(milliseconds / 3600000) % 24,
		minutes: roundTowardsZero(milliseconds / 60000) % 60,
		seconds: roundTowardsZero(milliseconds / 1000) % 60,
		milliseconds: roundTowardsZero(milliseconds) % 1000,
		microseconds: roundTowardsZero(milliseconds * 1000) % 1000,
		nanoseconds: roundTowardsZero(milliseconds * 1e6) % 1000
	};
}

async function GetGuildPrefix(guildId) {
    const GuildSettings = require('../schemas/GuildSchema');
    const config = require('../config.json');
    let prefix = config.prefix;
    let guildDB = await GuildSettings.findOne({ guildId: guildId });
    if (guildDB) {
        prefix = guildDB.prefix;
    }
    return prefix;
}

function GetDisplayName(itemId) {
    const ItemList = require('./items_list');
    let displayName;

    Object.keys(ItemList.potions).forEach(function (key) {
        if (key == itemId) {
            displayName = ItemList.potions[key].displayName;
        }
    });

    Object.keys(ItemList.items).forEach(function (key) {
        if (key == itemId) {
            displayName = ItemList.items[key].displayName;
        }
    });

    Object.keys(ItemList.crates).forEach(function (key) {
        if (key == itemId) {
            displayName = ItemList.crates[key].displayName;
        }
    });

    return displayName;
}

function IsValidItem(itemId) {
    const ItemList = require('./items_list');
    let isValid = false;

    Object.keys(ItemList.potions).forEach(function (key) {
        if (key === itemId) {
            isValid = true
        }
    });

    Object.keys(ItemList.items).forEach(function (key) {
        if (key === itemId) {
            isValid = true
        }
    });

    Object.keys(ItemList.crates).forEach(function (key) {
        if (key === itemId) {
            isValid = true
        }
    });

    return isValid;
}


function RemoveDuplicates(arr) {
    return [...new Set(arr)];
}

function Capitalise(string) {
    return string.split(' ').map(str => str.slice(0, 1).toUpperCase() + str.slice(1)).join(' ');
}

module.exports = {
    ErrorEmbed: ErrorEmbed,
    parseMS: parseMS,
    GetDisplayName: GetDisplayName,
    IsValidItem: IsValidItem,
    RemoveDuplicates: RemoveDuplicates,
    Capitalise: Capitalise,
    GetGuildPrefix: GetGuildPrefix
}