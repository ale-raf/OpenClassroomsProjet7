const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
// package qui permet de gérer les fichiers entrants lors des requêtes HTTP
const multer = require('../middleware/multer-config');

const bookCtrl = require('../controllers/book')

// routes individuelles pour chaque opération ; on attribue une méthode à chaque route
router.get('/', bookCtrl.getAllBooks);
router.get('/bestrating', bookCtrl.getBestBooks);
router.get('/:id', bookCtrl.getOneBook);
router.post('/', auth, multer, bookCtrl.createBook);
router.post('/:id/rating', auth, bookCtrl.rateBook);
router.put('/:id', auth, multer, bookCtrl.editBook);
router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router;