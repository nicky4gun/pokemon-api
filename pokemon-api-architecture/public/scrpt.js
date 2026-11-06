const searchField = document.getElementById('searchField');
const searchButton = document.getElementById('searchButton');
const pokemonImage = document.getElementById('pokemonImage');
const pokemonName = document.getElementById('pokemonName');
const pokemonTypes = document.getElementById('pokemonTypes');
const errorMessage = document.getElementById('error');
const favoritesButton = document.getElementById('favoritesButton');
const showfavoritesButton = document.getElementById('showFavoritesButton');
const favoritesList = document.getElementById('favoritesList');
const favoritesTitle = document.getElementById('favoritesTitle');
let currentPokemon = null;

searchButton.addEventListener('click', async () => {
  const pokemonNameToSearch = searchField.value.trim();
  errorMessage.textContent = '';
  currentPokemon = null;

  if (!pokemonNameToSearch) {
    errorMessage.textContent = 'Please enter a Pokémon name';
    return;
  }

  try {
    const response = await fetch(`/pokemon/${encodeURIComponent(pokemonNameToSearch)}`);
    const data = await response.json();

    if (!response.ok) {
      console.error('Error fetching Pokémon data:', data);
      errorMessage.textContent = data.error || 'Error fetching Pokémon data';
      pokemonImage.style.display = 'none';
      pokemonName.textContent = '';
      pokemonTypes.textContent = '';
      return;
    }

    currentPokemon = data;
    pokemonImage.src = data.image;
    pokemonImage.style.display = 'block';
    pokemonName.textContent = data.name;
    pokemonTypes.textContent = data.types.join(', ');
  } catch (error) {
    console.error('Error fetching Pokémon data:', error);
    errorMessage.textContent = 'Could not connect to the server';
  }
});

favoritesButton.addEventListener('click', async () => {
  errorMessage.textContent = '';

  if (!currentPokemon) {
    errorMessage.textContent = 'Search for a Pokémon before saving it';
    return;
  }

  try {
    const response = await fetch('/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: currentPokemon.id,
        name: currentPokemon.name,
        image: currentPokemon.image
      })
    });
    const data = await response.json();

    if (!response.ok) {
      errorMessage.textContent = data.error || 'Could not save favorite';
      return;
    }

    errorMessage.textContent = `${data.name} was added to your favorites`;
  } catch (error) {
    console.error('Error saving favorite:', error);
    errorMessage.textContent = 'Could not connect to the server';
  }
});

showfavoritesButton.addEventListener('click', async () => {
  errorMessage.textContent = '';
  favoritesList.replaceChildren();

  try {
    const response = await fetch('/favorites');
    const data = await response.json();

    if (!response.ok) {
      errorMessage.textContent = data.error || 'Could not load favorites';
      return;
    }

    if (data.length === 0) {
      errorMessage.textContent = 'You have no favorites yet';
      return;
    }

    data.forEach(favorite => {
      const listItem = document.createElement('li');
      const nameText = document.createElement('span');
      nameText.textContent = favorite.name;

      const updateButton = document.createElement('button');
      updateButton.textContent = 'Update';
      updateButton.type = 'button';
      updateButton.addEventListener('click', async () => {
        const updatedName = prompt('Enter a new Pokémon name:', favorite.name);
        if (updatedName === null || !updatedName.trim()) {
          return;
        }

        try {
          const updateResponse = await fetch(`/favorites/${favorite.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              id: favorite.id,
              name: updatedName.trim(),
              image: favorite.image
            })
          });
          const updateData = await updateResponse.json();

          if (!updateResponse.ok) {
            errorMessage.textContent = updateData.error || 'Could not update favorite';
            return;
          }

          errorMessage.textContent = `${updateData.name} was updated`;
          showfavoritesButton.click();
        } catch (error) {
          console.error('Error updating favorite:', error);
          errorMessage.textContent = 'Could not connect to the server';
        }
      });

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.type = 'button';
      deleteButton.addEventListener('click', async () => {
        try {
          const deleteResponse = await fetch(`/favorites/${favorite.id}`, {
            method: 'DELETE'
          });

          if (!deleteResponse.ok) {
            const deleteData = await deleteResponse.json();
            errorMessage.textContent = deleteData.error || 'Could not delete favorite';
            return;
          }

          errorMessage.textContent = `${favorite.name} was deleted`;
          showfavoritesButton.click();
        } catch (error) {
          console.error('Error deleting favorite:', error);
          errorMessage.textContent = 'Could not connect to the server';
        }
      });

      listItem.append(nameText, ' ', updateButton, ' ', deleteButton);
      listItem.style.display = 'block';

      favoritesList.appendChild(listItem);
    });
    favoritesTitle.style.display = 'block';
    favoritesTitle.textContent = 'Your Favorites';
  } catch (error) {
    console.error('Error fetching favorites:', error);
    errorMessage.textContent = 'Could not connect to the server';
  }
});
