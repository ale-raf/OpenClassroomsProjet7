const mongoose = require('mongoose');

///// Le plugin est désactivé car sa version actuelle semble incompatible avec la configuration du projet entraînant des erreurs /////

// const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);