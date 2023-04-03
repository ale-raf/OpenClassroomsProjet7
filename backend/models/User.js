const mongoose = require('mongoose');

// const uniqueValidator = require('mongoose-unique-validator');

///// Le plugin est désactivé car sa version actuelle semble incompatible avec la configuration du projet entraînant des erreurs /////

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);