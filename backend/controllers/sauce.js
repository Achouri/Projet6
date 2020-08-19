/* eslint-disable max-len */
const fs = require('fs');
const Sauce = require('../models/Sauce');

// Création d'une nouvelle sauce dans la BDD
exports.createSauce = (req, res) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename}`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ sauce }))
    .catch((error) => res.status(400).json({ error }));
};
/**
 * On crée ensuite une instance Sauce à partir de sauceObject , puis on effectue la modification.
 */
exports.modifySauce = (req, res) => {
  // Crée un objet sauceObjet pour mettre à jour l'URI de l'image
  const sauceObject = req.file
    ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${
        req.file.filename}`,
    }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id },
  )
    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
    .catch((error) => res.status(400).json({ error }));
};

// Suppression d'une sauce dans la BDD dont l'id === _id
exports.deleteSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// Récupère les données d'une sauce dont l'id === _id
exports.getOneSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

// Récupération de toutes les sauces de la BDD
exports.getAllSauces = (req, res) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

// Gestion des likes pour les sauces
exports.likeSauce = (req, res) => {
  switch (req.body.like) {
    case 0:
      Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
          if (sauce.usersLiked.find((user) => user === req.body.userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { likes: -1 },
                $pull: { usersLiked: req.body.userId },
                _id: req.params.id,
              },
            )
              .then(() => {
                res
                  .status(201)
                  .json({ message: 'Ton avis a été pris en compte!' });
              })
              .catch((error) => {
                res.status(400).json({ error });
              });
          }
          if (sauce.usersDisliked.find((user) => user === req.body.userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { dislikes: -1 },
                $pull: { usersDisliked: req.body.userId },
                _id: req.params.id,
              },
            )
              .then(() => {
                res
                  .status(201)
                  .json({ message: 'Ton avis a été pris en compte!' });
              })
              .catch((error) => {
                res.status(400).json({ error });
              });
          }
        })
        .catch((error) => {
          res.status(404).json({ error });
        });
      break;
    case 1:
      Sauce.updateOne(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
          $push: { usersLiked: req.body.userId },
          _id: req.params.id,
        },
      )
        .then(() => {
          res.status(201).json({ message: 'Ton like a été pris en compte!' });
        })
        .catch((error) => {
          res.status(400).json({ error });
        });
      break;
    case -1:
      Sauce.updateOne(
        { _id: req.params.id },
        {
          $inc: { dislikes: 1 },
          $push: { usersDisliked: req.body.userId },
          _id: req.params.id,
        },
      )
        .then(() => {
          res
            .status(201)
            .json({ message: 'Ton dislike a été pris en compte!' });
        })
        .catch((error) => {
          res.status(400).json({ error });
        });
      break;
    default:
      console.error('mauvaise requête');
  }
};
