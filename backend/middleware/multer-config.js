/* eslint-disable indent */
/* eslint-disable max-len */
// Multer est un package qui nous permet de gérer les fichiers entrants dans les requêtes HTTP
const multer = require('multer');

// Récupération des MIME TYPES pour en extraire les extentions
const MIME_TYPES = {
  'images/jpg': 'jpg',
  'images/jpeg': 'jpg',
  'images/png': 'png',
};

// Configuration de multer pour lui indiquer la logique nécessaire pour enregistrer les fichiers.
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  /**
  * La fonction filename indique à multer d'utiliser le nom d'origine,
  * de remplacer les espaces par des underscores et d'ajouter un timestamp Date.now() comme nom de fichier.
  * Elle utilise ensuite la constante dictionnaire de type MIME pour résoudre l'extension de fichier appropriée.
  */
  filname: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, `${name + Date.now()}.${extension}`);
  },
});

module.exports = multer({ storage }).single('image');
