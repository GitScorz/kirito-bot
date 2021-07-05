let potions = {};
let items = {};
let crates = {};

// Potions

potions["healpotion"] = { displayName: "Heal Potion", description: "Heals your troops after a combat", price: 100, usable: true };
potions["agilitypotion"] = { displayName: "Agility Potion", description: "Gives you more agility during the combat", price: 350, usable: true };
potions["strengthpotion"] = { displayName: "Strength Potion", description: "Believe me you will have more power", price: 400, usable: true };

// Items

items["fishingrod"] = { displayName: "Fishing Rod", description: "Lets fish!", price: 50, usable: false };
items["sword"] = { displayName: "Sword", description: "A cool sword", price: 150, usable: false };
items["helmet"] = { displayName: "Helmet", description: "This protect you from being hit in the head!", price: 250, usable: false };
items["chestplate"] = { displayName: "Chestplate", description: "A cool chestplate!", price: 400, usable: false };
items["leggings"] = { displayName: "Leggings", description: "Protect your lower body", price: 350, usable: false };
items["boots"] = { displayName: "Boots", description: "Achilles' heel", price: 200, usable: false };

// Crates

crates["woodcrate"] = { displayName: "Wood Crate", description: "Just a wood crate..", price: 60, usable: false };
crates["stonecrate"] = { displayName: "Stone Crate", description: "A cool stone crate", price: 140, usable: false };
crates["ironcrate"] = { displayName: "Iron Crate", description: "An iron crate", price: 250, usable: false };
crates["diamondcrate"] = { displayName: "Diamond Crate", description: "Wow a diamond crate!", price: 660, usable: false };


module.exports = {
    potions: potions,
    items: items,
    crates: crates
}