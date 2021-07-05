const mongoose = require('mongoose');

const CharacterSchema = new mongoose.Schema({
    name: { 
        type: mongoose.SchemaTypes.String,
        required: true
    },

    gold: mongoose.SchemaTypes.Number,

    troops: mongoose.SchemaTypes.Number,

    potionEffect: mongoose.SchemaTypes.String,

    alliance: mongoose.SchemaTypes.String,

    health: mongoose.SchemaTypes.Number,

    wins: mongoose.SchemaTypes.Number,

    loss: mongoose.SchemaTypes.Number,

    matches: mongoose.SchemaTypes.Number,

    userId: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('Character', CharacterSchema);