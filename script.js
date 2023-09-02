const pokemonList = document.getElementById('pokemon-list');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let offset = 0;
const limit = 3;

async function fetchPokemonList(offset, limit) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    const data = await response.json();
    return data.results;
}

async function fetchPokemonType(pokemonId) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const data = await response.json();
    const types = data.types.map(type => type.type.name);
    return types.join(', ');
}


async function displayPokemonList() {
    const pokemons = await fetchPokemonList(offset, limit);
    pokemonList.innerHTML = '';

    pokemons.forEach(async pokemon => {
        const pokemonCard = document.createElement('div');
        pokemonCard.classList.add('pokemon-card');

        const tipos = await fetchPokemonType(getPokemonId(pokemon.url));

        const typesString = tipos; // Sua string de tipos
        let typeBeforeComma = ""; // Variável para armazenar o resultado antes da vírgula

        for (let i = 0; i < typesString.length; i++) {
            if (typesString[i] === ',') {
                break; // Parar quando encontrar a vírgula
            }
            typeBeforeComma += typesString[i]; // Adicionar o caractere atual à nova string
        }

        pokemonCard.id = typeBeforeComma;




        const pokemonName = document.createElement('h2');
        pokemonName.textContent = pokemon.name;

        const pokemonImage = document.createElement('img');
        pokemonImage.classList.add('pokemon-image');
        pokemonImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonId(pokemon.url)}.png`;

        const typeText = document.createElement('p');
        typeText.classList.add('pokemon-type');
        typeText.textContent = await fetchPokemonType(getPokemonId(pokemon.url));

        pokemonCard.appendChild(pokemonName);
        pokemonCard.appendChild(pokemonImage);
        pokemonCard.appendChild(typeText);
        pokemonList.appendChild(pokemonCard);
    });

    updatePagination();
}

function getPokemonId(url) {
    const parts = url.split('/');
    return parts[parts.length - 2];
}

function updatePagination() {
    prevBtn.disabled = offset === 0;
    nextBtn.disabled = false;
}

prevBtn.addEventListener('click', () => {
    offset -= limit;
    if (offset < 0) offset = 0;
    displayPokemonList();
});

nextBtn.addEventListener('click', () => {
    offset += limit;
    displayPokemonList();
});

displayPokemonList();



