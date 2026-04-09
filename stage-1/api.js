const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';

export async function fetchPokemonData(nameOrId, signal) {
    try {
        const response = await fetch(`${BASE_URL}/${nameOrId.toLowerCase()}`, { signal });
        if (!response.ok) 
        throw new Error('Pokémon no encontrado');
        const data = await response.json();
        

let movesPromises = []
const primerosCuatro = data.moves.slice(0, 4);
for (let item of primerosCuatro) {
    let searchPromise = fetch(item.move.url).then(res => res.json());
    movesPromises.push(searchPromise);
}
const movesDetails = await Promise.allSettled(movesPromises);


let mimikyuTipos = [];
for (let i = 0; i < data.types.length; i++) {
    let nombreDelTipo = data.types[i].type.name;
    mimikyuTipos.push(nombreDelTipo);
}

let mimikyuEstadisticas = {};
for (let i = 0; i < data.stats.length; i++) {
    let nombreStat = data.stats[i].stat.name; 
    let valorStat = data.stats[i].base_stat;  
    mimikyuEstadisticas[nombreStat] = valorStat;
}


let mimikyuMovimientos = [];
for (let i = 0; i < movesDetails.length; i++) {
    let resultado = movesDetails[i];
    if (resultado.status === 'fulfilled') {
        mimikyuMovimientos.push(resultado.value.name);
    } 
    else {
        mimikyuMovimientos.push('Desconocido');
    }
}


const pokemonDetails = {
    name: data.name,
    sprite: data.sprites.other['official-artwork'].front_default,
    types: mimikyuTipos,
    stats: mimikyuEstadisticas,
    moves: mimikyuMovimientos
};
return pokemonDetails;

}
        catch (error) {
        if (error.name === 'AbortError') return null;
        throw error;
    }
}