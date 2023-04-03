const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // token récupéré depuis le header Authorization lors de la requête
        const token = req.headers.authorization.split(" ")[1];
        // on vérifie le token généré en le décodant
        const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
        // ID utilisateur extrait du token pour le rajouter à l’objet Request pour exploitation par les différentes routes
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } catch (error) {
        res.status(401).json({ error });
    }
};