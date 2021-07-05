const mongoose = require('mongoose');

const GuildSchema = new mongoose.Schema({
    guildId: mongoose.SchemaTypes.String,
    prefix: mongoose.SchemaTypes.String
});

module.exports = mongoose.model('Guild', GuildSchema);