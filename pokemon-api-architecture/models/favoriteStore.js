// Midlertidigt datalag: data forsvinder ved genstart (MongoDB kommer senere).
let favorites = [];
let nextId = 1;
const maxFavorites = 6;

exports.findAll = () => favorites;
exports.findById = id => favorites.find(f => f.id === id);
exports.create = ({ name, note = '' }) => {
  if (favorites.length >= maxFavorites) {
    const error = new Error('Maksimalt antal favoritter nået');
    error.code = 'MAX_FAVORITES';
    throw error;
  }
  const favorite = { id: nextId++, name: name.trim().toLowerCase(), note };
  favorites.push(favorite);
  return favorite;
};
exports.replace = (id, { name, note = '' }) => {
  const index = favorites.findIndex(f => f.id === id);
  if (index === -1) return null;
  const updated = { id, name: name.trim().toLowerCase(), note };
  favorites[index] = updated;
  return updated;
};
exports.remove = id => {
  const index = favorites.findIndex(f => f.id === id);
  if (index === -1) return false;
  favorites.splice(index, 1);
  return true;
};
// Bruges kun i automatiske tests.
exports.resetForTests = () => { favorites = []; nextId = 1; };
