const express = require('express');
const morgan = require('morgan');
const pokemonRoutes = require('./routes/pokemonRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(express.json());// Læs JSON fra POST/PUT
app.use(express.static('public'));
app.use(morgan('dev'));                // Log requests før routes
app.use('/pokemon', pokemonRoutes);    // Eksternt PokeAPI
app.use('/favorites', favoriteRoutes); // Vores egen CRUD

// Ukendt endpoint: 404 (efter routes, før error-handler)
app.use((req, res) => res.status(404).json({ error: 'Endpoint findes ikke' }));
app.use(errorHandler);                // Fire parametre: Express-fejlmiddleware

if (require.main === module) {
  app.listen(3002, () => console.log('Pokémon API: http://localhost:3002'));
}
module.exports = app;
