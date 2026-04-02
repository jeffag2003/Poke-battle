
export function renderTrainerCard(trainer, container) {
    container.innerHTML = `
        <div class="trainer-badge">
            <h1>Entrenador: ${trainer.name}</h1>
            <p><strong>De:</strong> ${trainer.hometown}</p>
            <p class="phrase">"${trainer.catchphrase}"</p>
        </div>
    `;
}


export function renderPokemon(pokemon, container, isPlayer = false) {

    if (!pokemon) {
        container.innerHTML = `
            <div class="skeleton-card">
                <div class="skeleton-img"></div>
                <p>Cargando datos del Pokémon...</p>
            </div>
        `;
        return;
    }

    if (isPlayer) {
        const tipoPrincipal = pokemon.types[0];
        document.body.className = `theme-${tipoPrincipal}`;
    }


    let htmlMovimientos = ""; 
    for (const mov of pokemon.moves) {
        htmlMovimientos = htmlMovimientos + "<li>" + mov + "</li>";
    }

    let htmlTipos = "";
    for (let i = 0; i < pokemon.types.length; i++) {
        let nombreDelTipo = pokemon.types[i];
        htmlTipos = htmlTipos + '<span class="type-tag">' + nombreDelTipo + '</span>';
    }

    container.innerHTML = `
        <div class="poke-card">
            <img src="${pokemon.sprite}" alt="${pokemon.name}">
            <h2 class="poke-name">${pokemon.name.toUpperCase()}</h2>
            <div class="types-container">
                ${htmlTipos}
            </div>
            <div class="stats-grid">
                <p><strong>HP:</strong> ${pokemon.stats.hp}</p>
                <p><strong>ATK:</strong> ${pokemon.stats.attack}</p>
                <p><strong>DEF:</strong> ${pokemon.stats.defense}</p>
                <p><strong>SPD:</strong> ${pokemon.stats.speed}</p>
            </div>
            <div class="moves-section">
                <h3>Movimientos:</h3>
                <ul class="moves-list">
                    ${htmlMovimientos}
                </ul>
            </div>
        </div>
    `;
}