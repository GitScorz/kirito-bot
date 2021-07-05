async function GetQueueLength() {
    const Queue = require('../schemas/QueueSchema');  

    let queueData = await Queue.find({ _id: "60c24056227d8127b0cefb36" })
    let queueLength;

    Object.keys(queueData).forEach(function (key) {
        queueLength = queueData[key].size
    });

    return queueLength;
}

async function RemoveFromQueue(userId) {
    const Queue = require('../schemas/QueueSchema');  
    const Match = require('../schemas/MatchSchema');

    let queueData = await Queue.find({ _id: "60c24056227d8127b0cefb36" })
    let queueLength;

    Object.keys(queueData).forEach(function (key) {
        queueLength = queueData[key].size
    });

    await Queue.findOneAndUpdate({ _id: "60c24056227d8127b0cefb36" }, { size: queueLength-1 });
    await Match.findOneAndDelete({ userId: userId });
}

async function SearchMatch(userId, tag, msgId, channelId) {
    const { FindMessage } = require('../../index');
    const Match = require('../schemas/MatchSchema');
    let find = await Match.find({});
    for (let i = 0; i < find.length; i++) {
        let getRandomUser = Math.floor((Math.random() * find.length) + 1);
        if (userId == find[getRandomUser-1].userId) return console.log("Catched the same id!");
        
        let oponentId = find[getRandomUser-1].userId;
        let oponentTag = find[getRandomUser-1].name;
        let oponentMsgId = find[getRandomUser-1].msgId;
        let oponentChannelId = find[getRandomUser-1].channelId;

        await FindMessage(channelId, oponentChannelId, msgId, oponentMsgId, tag, oponentTag);

        await Match.findOneAndUpdate({ userId: userId }, { inMatch: true, inQueue: false });
        await Match.findOneAndUpdate({ userId: oponentId }, { inMatch: true, inQueue: false });

        await Fight(userId, oponentId, channelId, oponentChannelId, msgId, oponentMsgId, tag, oponentTag);

        break;
    }
}

async function Fight(userId, oponentId, channelId, oponentChannelId, msgId, oponentMsgId, tag, oponentTag) {
    const Character = require('../schemas/CharacterSchema');
    const { FindMessage2 } = require('../../index');
    const userCharacterDB = await Character.findOne({ userId: userId });
    const oponentCharacterDB = await Character.findOne({ userId: oponentId });
    
    let userTroops = userCharacterDB.troops;
    let userHealth = userCharacterDB.health;
    let userEffect = userCharacterDB.potionEffect;

    let oponentTroops = oponentCharacterDB.troops;
    let oponentHealth = userCharacterDB.health;
    let oponentEffect = userCharacterDB.potionEffect;

    let match = await CalculateWin(userId, oponentId, userHealth, oponentHealth, userTroops, oponentTroops, tag, oponentTag, userEffect, oponentEffect);

    setTimeout(async () => {
        await FindMessage2(match.winner, match.loser, match.tag, match.oponentTag, channelId, oponentChannelId, msgId, oponentMsgId)
    }, Math.floor(Math.random() * 5000) + 3000)

}

async function CalculateWin(userId, oponentId, userHealth, oponentHealth, userTroops, oponentTroops, tag, oponentTag, userEffect, oponentEffect) {
    const Inventory = require('../schemas/InventorySchema');
    const inventoryUserDB = await Inventory.find({ userId: userId });
    const inventoryOponentDB = await Inventory.find({ userId: oponentId });

    let userItemId = {};
    let oponentItemId = {};

    let userChance = 0;
    let oponentChance = 0;
    
    Object.keys(inventoryUserDB).forEach(function (key) {
        userItemId[key] = inventoryUserDB[key].item;
    });

    Object.keys(inventoryOponentDB).forEach(function (key) {
        oponentItemId[key] = inventoryOponentDB[key].item;
    });

    let userItemsLength = Object.keys(inventoryUserDB).length;
    let oponentItemsLength = Object.keys(inventoryOponentDB).length;

    for (let i = 0; i < userItemsLength; i++) {
        if (userItemId[i] == "boots") {
            userChance = userChance + 5
        }

        if (userItemId[i] == "chestplate") {
            userChance = userChance + 25
        }

        if (userItemId[i] == "helmet") {
            userChance = userChance + 20
        }

        if (userItemId[i] == "leggings") {
            userChance = userChance + 10
        }
    }

    for (let i = 0; i < oponentItemsLength; i++) {
        if (oponentItemId[i] == "boots") {
            oponentChance = oponentChance + 5
        }

        if (oponentItemId[i] == "chestplate") {
            oponentChance = oponentChance + 25
        }

        if (oponentItemId[i] == "helmet") {
            oponentChance = oponentChance + 20
        }

        if (oponentItemId[i] == "leggings") {
            oponentChance = oponentChance + 10
        }
    }

    if (userHealth > oponentHealth) {
        userChance = userChance + 15
    } else {
        oponentChance = oponentChance + 15
    }

    if (userTroops > oponentTroops+150) {
        userChance = userChance + 15
    } else {
        oponentChance = oponentChance + 15
    }

    if (userEffect === "Strength") {
        userChance = userChance + 3
    } else if (oponentEffect === "Strength") {
        oponentChance = oponentChance + 3
    }

    if (userEffect === "Agility") {
        userChance = userChance + 2
    } else if (oponentEffect === "Agility") {
        oponentChance = oponentChance + 2
    }
    

    if (userChance > oponentChance) {
        return {
            winner: userId,
            loser: oponentId,
            tag: tag,
            oponentTag: oponentTag
        };
    } else if (oponentChance > userChance) {
        return {
            winner: oponentId,
            loser: userId, 
            tag: oponentTag, 
            oponentTag: tag
        };
    }

    if (userChance === oponentChance) {
        let prob = Math.floor(Math.random() * 2) + 1;
        if (prob === 1) return {
            winner: userId,
            loser: oponentId,
            tag: tag,
            oponentTag: oponentTag
        };
        if (prob === 2) return {
            winner: oponentId,
            loser: userId, 
            tag: oponentTag, 
            oponentTag: tag
        };
    }
}

module.exports = {
    GetQueueLength: GetQueueLength,
    RemoveFromQueue: RemoveFromQueue,
    SearchMatch: SearchMatch
}