const mongoose = require('mongoose');

const AllianceSchema = new mongoose.Schema({
    name: mongoose.SchemaTypes.String,
    users: mongoose.SchemaTypes.Number,
    minimumWins: mongoose.SchemaTypes.Number,
    state: mongoose.SchemaTypes.String,
    owner: mongoose.SchemaTypes.String,
    createdAt: mongoose.SchemaTypes.Number
});

module.exports = mongoose.model('Alliance', AllianceSchema);