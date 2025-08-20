document.addEventListener("DOMContentLoaded", () => {
    const pokemonListElement = document.getElementById("pokemon-list");
    const loadingSpinner = document.getElementById("loading-spinner");
    const noPokemonFoundElement = document.getElementById("no-pokemon-found");
    const searchInput = document.getElementById("search-input");
    const typeFilter = document.getElementById("type-filter");

    let allPokemonData = [];

    const typeColors = {
        normal: 'bg-gray-400',
        fire: 'bg-red-500',
        water: 'bg-blue-500',
        electric: 'bg-yellow-400',
        grass: 'bg-green-500',
        ice: 'bg-blue-200',
        fighting: 'bg-red-700',
        poison: 'bg-purple-500',
        ground: 'bg-yellow-600',
        flying: 'bg-indigo-400',
        psychic: 'bg-pink-500',
        bug: 'bg-green-400',
        rock: 'bg-yellow-800',
        ghost: 'bg-purple-700',
        dragon: 'bg-indigo-700',
        dark: 'bg-gray-800',
        steel: 'bg-gray-500',
        fairy: 'bg-pink-300',
    };

    const fetchPokemon = async () => {
        loadingSpinner.classList.remove("hidden");
        pokemonListElement.innerHTML = "";
        noPokemonFoundElement.classList.add("hidden");

        try {
            const pokemonData = [];
            for (let i = 1; i <= 200; i++) {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
                if (!response.ok) {
                    throw new Error(`Erro ao buscar Pokémon ${i}`);
                }
                const data = await response.json();
                pokemonData.push(data);
            }
            allPokemonData = pokemonData;
            renderPokemon(allPokemonData);
        } catch (err) {
            console.error("Erro ao carregar Pokédex:", err);
            loadingSpinner.innerHTML = `
                <div class="text-center">
                    <div class="text-6xl mb-4">😞</div>
                    <h2 class="text-2xl font-bold text-red-800 mb-2">
                        Erro ao carregar Pokédex
                    </h2>
                    <p class="text-red-600 mb-4">${err.message}</p>
                    <button onclick="window.location.reload()" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Tentar novamente
                    </button>
                </div>
            `;
        } finally {
            loadingSpinner.classList.add("hidden");
        }
    };

    const renderPokemon = (pokemonArray) => {
        pokemonListElement.innerHTML = "";
        if (pokemonArray.length === 0) {
            noPokemonFoundElement.classList.remove("hidden");
            return;
        }
        noPokemonFoundElement.classList.add("hidden");

        pokemonArray.forEach((pokemon, index) => {
            const pokemonCard = document.createElement("div");
            pokemonCard.className = `w-full max-w-sm mx-auto pokemon-card-hover cursor-pointer animate-fade-in-up`;
            pokemonCard.style.animationDelay = `${index * 0.1}s`;

            const currentSprite = pokemon.sprites.front_default;
            const shinySprite = pokemon.sprites.front_shiny;

            const typesHtml = pokemon.types.map(type => `
                <span class="px-3 py-1 rounded-full text-white text-sm font-medium type-badge ${typeColors[type.type.name] || 'bg-gray-400'}">
                    ${type.type.name}
                </span>
            `).join('');

            pokemonCard.innerHTML = `
                <div class="p-6 bg-white rounded-lg shadow-md">
                    <div class="text-center pb-2">
                        <h2 class="text-lg font-bold capitalize">${pokemon.name}</h2>
                        <p class="text-sm text-gray-500">#${pokemon.id.toString().padStart(3, '0')}</p>
                    </div>
                    <div class="text-center">
                        <div class="relative mb-4">
                            <div class="w-32 h-32 mx-auto rounded-full flex items-center justify-center transition-all duration-500 bg-gradient-to-br from-blue-100 to-purple-100" data-pokemon-id="${pokemon.id}">
                                <img
                                    src="${currentSprite}"
                                    alt="${pokemon.name}"
                                    class="w-24 h-24 transition-all duration-500 opacity-100 scale-100"
                                    data-normal-src="${currentSprite}"
                                    data-shiny-src="${shinySprite}"
                                />
                            </div>
                            <div class="absolute top-2 right-2 animate-bounce-in">
                                <span class="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-600" data-shiny-label="normal">
                                    Normal
                                </span>
                            </div>
                        </div>
                        
                        <div class="flex flex-wrap justify-center gap-2 mb-4">
                            ${typesHtml}
                        </div>

                        <div class="grid grid-cols-2 gap-2 text-sm">
                            <div class="bg-gray-100 rounded p-2">
                                <p class="font-semibold">Altura</p>
                                <p>${(pokemon.height / 10).toFixed(1)}m</p>
                            </div>
                            <div class="bg-gray-100 rounded p-2">
                                <p class="font-semibold">Peso</p>
                                <p>${(pokemon.weight / 10).toFixed(1)}kg</p>
                            </div>
                        </div>

                        <div class="mt-4">
                            <p class="text-xs text-gray-500">
                                Clique na imagem para ver a versão shiny!
                            </p>
                        </div>
                    </div>
                </div>
            `;
            pokemonListElement.appendChild(pokemonCard);

            // Adicionar evento de clique para a imagem (shiny)
            const pokemonImageContainer = pokemonCard.querySelector(`[data-pokemon-id="${pokemon.id}"]`);
            const pokemonImage = pokemonImageContainer.querySelector("img");
            const shinyLabel = pokemonImageContainer.nextElementSibling.querySelector("[data-shiny-label]");

            pokemonImageContainer.addEventListener("click", () => {
                if (pokemonImage.src === pokemonImage.dataset.normalSrc) {
                    pokemonImage.src = pokemonImage.dataset.shinySrc;
                    shinyLabel.textContent = "✨ Shiny";
                    shinyLabel.classList.remove("bg-gray-200", "text-gray-600");
                    shinyLabel.classList.add("bg-yellow-200", "text-yellow-800", "animate-sparkle");
                } else {
                    pokemonImage.src = pokemonImage.dataset.normalSrc;
                    shinyLabel.textContent = "Normal";
                    shinyLabel.classList.remove("bg-yellow-200", "text-yellow-800", "animate-sparkle");
                    shinyLabel.classList.add("bg-gray-200", "text-gray-600");
                }
            });

            // Adicionar eventos de hover
            pokemonCard.addEventListener("mouseenter", () => {
                pokemonCard.classList.add("hovered");
            });
            pokemonCard.addEventListener("mouseleave", () => {
                pokemonCard.classList.remove("hovered");
            });
        });
    };

    const applyFilters = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedType = typeFilter.value;

        const filteredPokemon = allPokemonData.filter(pokemon => {
            const matchesSearch = pokemon.name.toLowerCase().includes(searchTerm);
            const matchesType = selectedType === "all" || 
                                pokemon.types.some(type => type.type.name === selectedType);
            return matchesSearch && matchesType;
        });
        renderPokemon(filteredPokemon);
    };

    searchInput.addEventListener("input", applyFilters);
    typeFilter.addEventListener("change", applyFilters);

    fetchPokemon();
});


