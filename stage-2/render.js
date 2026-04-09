export function render(state) {
    const root = document.getElementById('battle-arena');
    let hpPercentage = (state.playerHP / state.maxPlayerHP) * 100;
    let playerCells = "";
    for (let i = 1; i <= 3; i++) {
        let cellClass = "cell";
        if (state.incomingAttack === i) {
            cellClass = cellClass + " warning";
        }
        if (state.locked && state.incomingAttack === i) {
            cellClass = cellClass + " impact";
        }
        
        let playerImage = "";
        if (state.playerPosition === i) {
            playerImage = '<img src="' + state.player.sprite + '" class="sprite">';
        }
        playerCells = playerCells + '<div class="' + cellClass + '">';
        playerCells = playerCells +  playerImage;
        playerCells = playerCells + '<span class="position-label">position ' + i + '</span>';
        playerCells = playerCells + '</div>';
    }

    let logMessages = "";
    for (let i = 0; i < state.log.length; i++) {
        if (i >= state.log.length - 3) {
            logMessages = logMessages + "<p>" + state.log[i] + "</p>";
        }
    }

    root.innerHTML = `
        <div class="arena-container">
            
            <div class="row enemy-row">
                <div class="cell active">
                    <img src="${state.opponent.sprite}" class="sprite">
                    <div class="hp-text">${state.opponentHP} HP</div>
                </div>
                <div class="cell"></div>
                <div class="cell"></div>
            </div>

            <div class="battle-log">
                ${logMessages}
            </div>

            <div class="row player-row">
                ${playerCells}
            </div>

            <div class="controls">
                <span>${state.player.name}</span>
                <div class="hp-bar">
                    <div class="hp-fill" style="width: ${hpPercentage}%"></div>
                </div>
                
                <div class="buttons">
                    <button id="atk-btn">ATTACK</button>
                    <button id="def-btn">ULTIMATE</button>
                </div>
            </div>
        </div>
    `;

    const atkBtn = document.getElementById('atk-btn');
    const defBtn = document.getElementById('def-btn');

    if (atkBtn) {
        if (state.attackOnCooldown || state.phase === 'ended') {
            atkBtn.disabled = true;
        }
    }

    if (defBtn) {
        if (state.definitiveUsed || state.phase === 'ended') {
            defBtn.disabled = true;
        }
    }
}