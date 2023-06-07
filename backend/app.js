const { config } = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

// importation des routeurs
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');

// importation du fichier .env avec les variables comprises
config();

const SRV_ADRESS = process.env.SRV_ADRESS;
const PASSWORD = process.env.PASSWORD;

// on établit ici la connexion avec notre base de données et on facilite aussi la communication avec celle-ci
mongoose.connect(`mongodb+srv://${SRV_ADRESS}:${PASSWORD}@cluster0.c0meqjm.mongodb.net/?retryWrites=true&w=majority`,
{ useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

// on définit un accès libre à notre API en autorisant les requêtes cross-origin
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

// on enregistre nos routeurs en fonction des demandes effectuées vers chaque route
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;