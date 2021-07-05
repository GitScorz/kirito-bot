const mongoose = require('mongoose');

const DailySchema = new mongoose.Schema({
    lastDaily: mongoose.SchemaTypes.Number,
    userId: mongoose.SchemaTypes.String
});

module.exports = mongoose.model('Daily', DailySchema);