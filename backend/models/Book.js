const mongoose = require('mongoose');

// schéma de données pour l'objet Book
const bookSchema = mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    ratings: [
        {
            userId: { type: String, required: true },
            grade: { type: Number, required: true },
        }
    ],
    averageRating: { type: Number, required: true },
});

// schéma converti en modèle pour l'exploitation
module.exports = mongoose.model('Book', bookSchema);