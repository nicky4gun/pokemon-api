const store = require('../models/favoriteStore');
exports.getAll = (req, res) => res.json(store.findAll());
exports.getOne = (req, res) => {
  const favorite = store.findById(req.favoriteId);
  if (!favorite) return res.status(404).json({ error: 'Favorit findes ikke' });
  res.json(favorite);
};
exports.create = (req, res, next) => {
  try {
    const favorite = store.create(req.body);
    res.status(201).location(`/favorites/${favorite.id}`).json(favorite);
  } catch (error) {
    if (error.code === 'MAX_FAVORITES') {
      return res.status(400).json({ error: error.message });
    }

    next(error);
  }
};
exports.replace = (req, res) => {
  const favorite = store.replace(req.favoriteId, req.body);
  if (!favorite) return res.status(404).json({ error: 'Favorit findes ikke' });
  res.json(favorite);
};
exports.remove = (req, res) => {
  if (!store.remove(req.favoriteId)) return res.status(404).json({ error: 'Favorit findes ikke' });
  res.status(204).end();
};
