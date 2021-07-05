const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
    startedSearching: mongoose.SchemaTypes.Number,
    name: mongoose.SchemaTypes.String,
    inQueue: mongoose.SchemaTypes.Boolean,
    inMatch: mongoose.SchemaTypes.Boolean,
    userId: mongoose.SchemaTypes.String,
    msgId: mongoose.SchemaTypes.String,
    channelId: mongoose.SchemaTypes.String
});

module.exports = mongoose.model('Match', MatchSchema);