const Book = require("../models/Book");
const fs = require("fs");

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    });
    book
        .save()
        .then(() => res.status(201).json({ message: "Livre enregistré !" }))
        .catch((error) => res.status(400).json({ error }));
};

exports.editBook = (req, res, next) => {
    const bookObject = req.file
        ? {
            ...JSON.parse(req.body.book),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        }
        : { ...req.body };
    delete bookObject._userId;
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: "Not authorized" });
            } else {
                Book.updateOne(
                    { _id: req.params.id },
                    { ...bookObject, _id: req.params.id }
                )
                    .then(() => res.status(200).json({ message: "Livre modifié !" }))
                    .catch((error) => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: "Not authorized" });
            } else {
                const filename = book.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => {
                            res.status(200).json({ message: "Livre supprimé !" });
                        })
                        .catch((error) => res.status(401).json({ error }));
                });
            }
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => res.status(200).json(book))
        .catch((error) => res.status(404).json({ error }));
};

exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then((books) => res.status(200).json(books))
        .catch((error) => res.status(400).json({ error }));
};

exports.getBestBooks = (req, res, next) => {
    Book.find()
        .sort({ averageRating: -1 })
        .limit(3)
        .then((books) => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
};

exports.rateBook = (req, res) => {
    const bookRating = req.body;
    delete bookRating._userId;
    // if (bookRating.userId != req.auth.userId) {
    //     res.status(401).json({ message: "Not authorized" });
    // }
    Book.findOne({ _id: req.params.id })
    .then((book) => {
            const ratings = book.ratings;
            if (ratings.find(rating => rating.userId === req.auth.userId)) {
                res.status(401).json({ message : 'Vous avez déjà attribué une note à ce livre' });
            } else {
                let updatedRatings = [];
                // on parcourt ratings pour pousser chaque note vers le tableau vide initialisé juste au-dessus
                ratings.forEach(rating => {
                    updatedRatings.push(rating)
                });
                // nouvelle note saisie lors de la requête est poussée à son tour vers le tableau updatedRatings
                updatedRatings.push({userId: bookRating.userId, grade: bookRating.rating});
                // calcul de la moyenne des notes enregistrées sur le livre présent
                const updatedAverage = calcAverage(updatedRatings);
                Book.findByIdAndUpdate(
                    { _id: req.params.id },
                    { $push: { ratings: { userId: bookRating.userId, grade: bookRating.rating }}, $set: { averageRating: updatedAverage }},
                    { new: true }
                )
                    .then((book) => res.status(200).json(book))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch(error => res.status(400).json({ error }));
};

function calcAverage(array) {
    // on retourne un nouveau tableau composé des seules notes (grade) que l'on réduit pour obtenir la somme des valeurs
    // la somme obtenue est divisée par le nombre de valeurs présentes dans le tableau d'origine
    const averageResult = (array.map(rating => rating.grade).reduce((acc, currentRating) => acc + currentRating) / array.length).toFixed(1);
    return averageResult;
}