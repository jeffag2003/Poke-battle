
import TRAINER from '../trainer.config.js'; 
import { fetchPokemonData } from './api.js';
import { renderTrainerCard, renderPokemon } from './render.js';
const trainerContainer = document.getElementById('trainer-section');
const playerContainer = document.getElementById('player-pokemon');
const opponentContainer = document.getElementById('opponent-pokemon');
const searchInput = document.getElementById('opponent-search');
const goBtn = document.getElementById('go-to-battle');
let myPokemonData = null;
let opponentPokemonData = null;

async function main() {
try {
        renderTrainerCard(TRAINER, trainerContainer); 
        renderPokemon(null, playerContainer, true);
        const myPokemon = await fetchPokemonData(TRAINER.favoritePokemon);   
        if (myPokemon) {
            myPokemonData = myPokemon;
            renderPokemon(myPokemon, playerContainer, true);
        }
    } 
    catch (error) {
    playerContainer.innerHTML = '<p>Error al cargar Pokémon</p>';
    }
}

let timeoutId;
let controller;
searchInput.addEventListener('input', (event) => {
    const pokemonName = event.target.value.toLowerCase().trim();
    clearTimeout(timeoutId);
    
    if (!pokemonName) {
        opponentContainer.innerHTML = '<p>Esperando oponente...</p>';
        opponentPokemonData = null; 
        goBtn.disabled = true; 
        return;
    }
    
    if (controller) controller.abort(); 
    controller = new AbortController();
    
    timeoutId = setTimeout(async () => {
        try {
            renderPokemon(null, opponentContainer);
            const opponent = await fetchPokemonData(pokemonName, controller.signal);
            
            if (opponent) {
                opponentPokemonData = opponent;
                renderPokemon(opponent, opponentContainer);
                
                if (myPokemonData) { 
                    goBtn.disabled = false;
                }
            } 
            else {
                opponentContainer.innerHTML = '<p>¡Pokémon no encontrado!</p>';
                goBtn.disabled = true
            }
        } 
        catch (error) {
            if (error.name === 'AbortError') 
            return;
        }
    }, 500);
});

goBtn.addEventListener('click', () => {
    if (myPokemonData && opponentPokemonData) {
        localStorage.setItem('playerPokemon', JSON.stringify(myPokemonData));
        localStorage.setItem('opponentPokemon', JSON.stringify(opponentPokemonData));
        localStorage.setItem('trainerData', JSON.stringify(TRAINER));
        window.location.href = '../stage-2/index.html';
    }
});

main();