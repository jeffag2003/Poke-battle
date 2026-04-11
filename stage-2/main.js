import { state, calcPlayerDamage, calcEnemyDamage, wait } from './battle.js';
import { render } from './render.js';

function main() {
    state.player = JSON.parse(localStorage.getItem('playerPokemon'));
    state.opponent = JSON.parse(localStorage.getItem('opponentPokemon'));

    state.maxPlayerHP = Math.floor(state.player.stats.hp * 2.5);
    state.playerHP = state.maxPlayerHP;
    state.maxOpponentHP = Math.floor(state.opponent.stats.hp * 2.5);
    state.opponentHP = state.maxOpponentHP;

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('click', onClick);

    render(state);
    scheduleNextAttack();
}

let attackTimeout = null;
function scheduleNextAttack() {
    const delay = (3 + Math.random() * 7) * 1000;
    attackTimeout = setTimeout(async () => {
        await resolveEnemyAttack();
        if (state.phase === 'fighting') scheduleNextAttack();
    }, delay);
}

async function resolveEnemyAttack() {
    const targetCell = Math.floor(Math.random() * 3) + 1; 
    state.incomingAttack = targetCell;
    state.locked = false;
    render(state); 

    await wait(600); 

    state.locked = true;
    render(state); 

    if (state.playerPosition === targetCell) {
        state.playerHP -= calcEnemyDamage(state.opponent);
        state.log.push(`Hit! You took damage.`);
    } else {
        state.log.push(`Dodged!`);
    }

    state.incomingAttack = null;
    state.locked = false;
    checkBattleEnd(state);
    render(state);
}

function onKeyDown(e) {
    if (state.phase !== 'fighting' || state.locked) return;
    if (e.key === 'ArrowLeft' && state.playerPosition > 1) state.playerPosition--;
    if (e.key === 'ArrowRight' && state.playerPosition < 3) state.playerPosition++;
    render(state);
}

function onClick(e) {
    if (state.phase !== 'fighting') return;

    if (e.target.id === 'atk-btn' && !state.attackOnCooldown) {
        const damage = calcPlayerDamage(state.player);
        state.opponentHP = Math.max(0, state.opponentHP - damage);
        state.log.push(`You dealt ${damage} damage.`);
        checkBattleEnd(state);
        const bar = document.getElementById('cd-progress');
        startCooldown(3000, bar);
    }

    if (e.target.id === 'def-btn' && !state.definitiveUsed) {
        state.definitiveUsed = true;
        state.opponentHP = 0;
        state.log.push(`ULTIMATE MOVE USED!`);
        checkBattleEnd(state);
        render(state);
    }
}

function startCooldown(durationMs, barElement) {
    const start = performance.now();
    state.attackOnCooldown = true;
    render(state);
    function tick(now) {
        const elapsed = now - start;
        const pct = Math.min(elapsed / durationMs, 1);
        if (barElement) barElement.style.width = (1 - pct) * 100 + '%';
        if (pct < 1) {
            requestAnimationFrame(tick);
        } else {
            state.attackOnCooldown = false;
            render(state);
        }
    }
    requestAnimationFrame(tick);
}

function checkBattleEnd(currentState) {
    if (currentState.playerHP <= 0 || currentState.opponentHP <= 0) endBattle();
}

function endBattle() {
    state.phase = 'ended';
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('click', onClick);
    clearTimeout(attackTimeout);
    state.log.push(state.playerHP > 0 ? "VICTORY!" : "GAME OVER...");
    render(state);
}

main();