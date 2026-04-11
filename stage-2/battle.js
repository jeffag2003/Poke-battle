export const state = {
    playerHP: 0,
    opponentHP: 0,
    maxPlayerHP: 0,
    maxOpponentHP: 0,
    playerPosition: 2,    
    locked: false,        
    definitiveUsed: false,
    attackOnCooldown: false,
    phase: 'fighting',   
    log: [],
    incomingAttack: null, 
    player: null,         
    opponent: null     
    
};

export const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export function calcPlayerDamage(pokemon) {
    const movePower = 60; 
    const damage = Math.floor(movePower * 0.3) + Math.floor(Math.random() * movePower * 0.4);
    return damage;
}

export function calcEnemyDamage(opponent) {
    const attackStat = opponent.stats.attack;
    const damage = Math.floor(attackStat * 0.4) + Math.floor(Math.random() * 20);
    return damage;
}