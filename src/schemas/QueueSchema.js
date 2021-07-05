const mongoose = require('mongoose');

const QueueSchema = new mongoose.Schema({
    size: mongoose.SchemaTypes.Number
});

module.exports = mongoose.model('Queue', QueueSchema);