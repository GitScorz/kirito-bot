const mongoose = require('mongoose');

const TrainSchema = new mongoose.Schema({
    troops: mongoose.SchemaTypes.Number,
    trainStart: mongoose.SchemaTypes.Number,
    currentlyTraining: mongoose.SchemaTypes.Boolean,
    userId: mongoose.SchemaTypes.String,
});

module.exports = mongoose.model('Train', TrainSchema);