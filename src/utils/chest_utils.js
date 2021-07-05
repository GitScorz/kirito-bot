async function WoodCrateReward(user) {
    const Character = require('../schemas/CharacterSchema');
    const characterDB = await Character.findOne({ userId: user.id });
    let currentGold = characterDB.gold;
    let random = Math.random() * 100; 
    let mny1am
    if (random >= 0 && random <= 50) mny1am = 20;
    else if (random > 50 && random <= 75) mny1am = 60;
    else if (random > 75 && random <= 90) mny1am = 250;
    else if (random > 90 && random <= 98) mny1am = 300;
    else if (random > 98 && random <= 100) mny1am = 500;
    else {
        mny1am = 500;
    }
    await Character.findOneAndUpdate({ userId: user.id }, { gold: currentGold + mny1am })
    return "`" + mny1am + "`<:gold:851858239284969473>";
}

async function StoneCrateReward(user) {
    const Character = require('../schemas/CharacterSchema');
    const characterDB = await Character.findOne({ userId: user.id });
    let currentGold = characterDB.gold;
    let random = Math.random() * 100; 
    let mny1am
    if (random >= 0 && random <= 50) mny1am = 130;
     else if (random > 50 && random <= 75) mny1am = 250;
     else if (random > 75 && random <= 90) mny1am = 300;
     else if (random > 90 && random <= 98) mny1am = 350;
     else if (random > 98 && random <= 100) mny1am = 380;
     else {
     mny1am = 500;
    }
    await Character.findOneAndUpdate({ userId: user.id }, { gold: currentGold + mny1am })
    return "`" + mny1am + "`<:gold:851858239284969473>";
}


async function IronCrateReward(user) {
    const Character = require('../schemas/CharacterSchema');
    const characterDB = await Character.findOne({ userId: user.id });
    let currentGold = characterDB.gold;
    let random = Math.random() * 100; 
    let mny1am
    if (random >= 0 && random <= 50) mny1am = 150;
    else if (random > 50 && random <= 75) mny1am = 400;
    else if (random > 75 && random <= 90) mny1am = 500;
    else if (random > 90 && random <= 98) mny1am = 800;
    else if (random > 98 && random <= 100) mny1am = 1400;
    else {
        mny1am = 500;
    }
    await Character.findOneAndUpdate({ userId: user.id }, { gold: currentGold + mny1am })
    return "`" + mny1am + "`<:gold:851858239284969473>";
}


async function DiamondCrateReward(user) {
    const Character = require('../schemas/CharacterSchema');
    const characterDB = await Character.findOne({ userId: user.id });
    let currentGold = characterDB.gold;
    let random = Math.random() * 100; 
    let mny1am
    if (random >= 0 && random <= 50) mny1am = 200;
    else if (random > 50 && random <= 75) mny1am = 450;
    else if (random > 75 && random <= 90) mny1am = 500;
    else if (random > 90 && random <= 98) mny1am = 1000;
    else if (random > 98 && random <= 100) mny1am = 3000;
    else {
    mny1am = 500;
    }
    await Character.findOneAndUpdate({ userId: user.id }, { gold: currentGold + mny1am })
    return "`" + mny1am + "`<:gold:851858239284969473>";
}

module.exports = {
    WoodCrateReward: WoodCrateReward,
    StoneCrateReward: StoneCrateReward,
    IronCrateReward: IronCrateReward,
    DiamondCrateReward: DiamondCrateReward,
}