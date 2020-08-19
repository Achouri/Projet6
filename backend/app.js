const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const path = require('path');
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

const app = express();

// Connexion à la base de donnée mongoDB
mongoose
  .connect(
    'mongodb+srv://achouri01:achouri01@cluster0.orkvi.gcp.mongodb.net/test',
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  )
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Permet d'accéder à l'API depuis n'importe quelle origine
app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization',
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  );
  next();
});

// Permet de parser les requêtes envoyées apr le client, on accède au body via 'req.body'
app.use(bodyParser.json());

// Permet de charger les images dans le dossier 'images'
app.use('/images', express.static(path.join(__dirname, 'images')));

// Préfix des routes par défaut pour les requêtes
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use(helmet());

module.exports = app;
