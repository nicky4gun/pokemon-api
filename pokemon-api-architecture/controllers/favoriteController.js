//const store = require('../models/favoriteStore');
const Database = require('../models/favoriteDatabase');
const MAX_TEAM_SIZE = 6;

exports.getAll = async (req, res, next) => {
  try {
    res.json(await Database.find());
  } catch (error) {
    next(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const favorite = await Database.findOne({ id: req.favoriteId });
    if (!favorite) return res.status(404).json({ error: 'Favorit findes ikke' });
    res.json(favorite);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const favoriteCount = await Database.countDocuments();
    if (favoriteCount >= MAX_TEAM_SIZE) {
      return res.status(409).json({
        error: 'Dit Pokémon-hold må højst have 6 Pokémon'
      });
    }

    const favorite = await Database.create(req.body);
    res.status(201).location(`/favorites/${favorite.id}`).json(favorite);
  } catch (error) {
    next(error);
  }
};

exports.replace = async (req, res, next) => {
  try {
    const favorite = await Database.findOneAndReplace(
        { id: req.favoriteId },
        req.body,
        { new: true, runValidators: true }
    );
    if (!favorite) return res.status(404).json({ error: 'Favorit findes ikke' });
    res.json(favorite);
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const deleted = await Database.findOneAndDelete({ id: req.favoriteId });
    if (!deleted) return res.status(404).json({ error: 'Favorit findes ikke' });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

