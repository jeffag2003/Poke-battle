export function render(state) {
    const root = document.getElementById('battle-arena');
    
    let hpPercentage = (state.playerHP / state.maxPlayerHP) * 100;
    let opponentHpPct = (state.opponentHP / state.maxOpponentHP) * 100;

    let opponentTypes = "";
    for (let i = 0; i < state.opponent.types.length; i++) {
        opponentTypes = opponentTypes + '<span class="tipo-badge">' + state.opponent.types[i] + '</span> ';
    }

    let playerCells = "";
    for (let i = 1; i <= 3; i++) {
        let cellClass = "cell";
        if (state.incomingAttack === i) cellClass = cellClass + " warning";
        if (state.locked && state.incomingAttack === i) cellClass = cellClass + " impact";
        
        let playerImage = "";
        if (state.playerPosition === i) {
            playerImage = '<img src="' + state.player.sprite + '" class="sprite">';
        }
        playerCells = playerCells + '<div class="' + cellClass + '">' +
                      playerImage +
                      '<span class="position-label">position ' + i + '</span>' +
                      '</div>';
    }

    let logMessages = "";
    const lastMessages = state.log.slice(-3);
    for (let i = 0; i < lastMessages.length; i++) {
        logMessages = logMessages + "<p>" + lastMessages[i] + "</p>";
    }

    root.innerHTML = 
        '<div class="arena-container">' +
            '<div class="row enemy-row">' +
                '<div class="status-box">' +
                    '<h2>' + state.opponent.name.toUpperCase() + '</h2>' +
                    '<div class="tipos-rival">' + opponentTypes + '</div>' +
                    '<div class="hp-bar">' +
                        '<div class="hp-fill" style="width:' + (opponentHpPct > 0 ? opponentHpPct : 0) + '%"></div>' +
                    '</div>' +
                    '<span>' + state.opponentHP + ' HP</span>' +
                '</div>' +
                '<div class="cell active">' +
                    '<img src="' + state.opponent.sprite + '" class="sprite">' +
                '</div>' +
            '</div>' +

            '<div class="battle-log">' + logMessages + '</div>' +

            '<div class="row player-row">' + playerCells + '</div>' +

            '<div class="controls">' +
                '<strong>' + state.player.name.toUpperCase() + '</strong>' +
                '<div class="hp-bar">' +
                    '<div class="hp-fill player-hp" style="width: ' + (hpPercentage > 0 ? hpPercentage : 0) + '%"></div>' +
                '</div>' +
                '<div class="buttons">' +
                    '<div class="atk-wrapper">' +
                        '<button id="atk-btn" ' + (state.attackOnCooldown || state.phase === "ended" ? "disabled" : "") + '>ATTACK</button>' +
                        '<div class="cd-bar-container">' + 
                            '<div id="cd-progress" class="cd-fill"></div>' +
                        '</div>' +
                    '</div>' +
                    '<button id="def-btn" ' + (state.definitiveUsed || state.phase === "ended" ? "disabled" : "") + '>Sombra Maldita</button>' +
                '</div>' +
                (state.phase === "ended" ? 
                    '<div class="reiniciar-box">' +
                        '<button onclick="window.location.href=\'../stage-1/index.html\'" class="btn-again">' +
                            'BATTLE AGAIN' +
                        '</button>' +
                    '</div>' 
                : "") +
            '</div>' +
        '</div>';
}