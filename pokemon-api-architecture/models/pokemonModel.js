const axios = require('axios');

// Model: ingen Express req/res her. Kun ekstern dataadgang og transformation.
exports.fetchPokemon = async (name) => {
  try {
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(name)}`,
      { timeout: 5000 }
    );
    const data = response.data;
    return {
      id: data.id,
      name: data.name,
      types: data.types.map(t => t.type.name),
      image: data.sprites.other['official-artwork'].front_default

    };
  } catch (err) {
    const error = new Error('PokeAPI-opslag mislykkedes');
    error.status = err.response?.status === 404 ? 404 : 502;
    throw error;
  }
};
