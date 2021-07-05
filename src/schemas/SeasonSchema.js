const mongoose = require('mongoose');

const SeasonSchema = new mongoose.Schema({
    season: mongoose.SchemaTypes.Number
});

module.exports = mongoose.model('Season', SeasonSchema);