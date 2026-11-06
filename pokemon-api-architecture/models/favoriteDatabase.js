const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
    name: {type: String, required: true},
    id: {type: Number, required: true, unique: true},
    image: {type: String, required: true},
});

 const Pokemon = mongoose.model('Pokemon', favoriteSchema);
module.exports = Pokemon;


