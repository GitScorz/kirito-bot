const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
    item: mongoose.SchemaTypes.String,
    amount: mongoose.SchemaTypes.Number,
    userId:  mongoose.SchemaTypes.String
});

module.exports = mongoose.model('Inventory', InventorySchema);