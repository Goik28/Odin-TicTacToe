{//Protect select choices, disabling both players having the same symbol.
    document.getElementById("playerOne_Symbol").addEventListener("change", (e) => {
        if (e.target.selectedIndex == 0) {
            document.getElementById("playerTwo_Symbol").selectedIndex = 1;
        } else {
            document.getElementById("playerTwo_Symbol").selectedIndex = 0;
        }
    });
    document.getElementById("playerTwo_Symbol").addEventListener("change", (e) => {
        if (e.target.selectedIndex == 0) {
            document.getElementById("playerOne_Symbol").selectedIndex = 1;
        } else {
            document.getElementById("playerOne_Symbol").selectedIndex = 0;
        }
    });
}
let playerList = [];
let playerOneLock = false;
let playerTwoLock = false;
let playerOneTurn = false;
let gameBoard = [];

const playerFactory = (name, type, symbol, color) => {
    let wins = 0;
    const countWins = () => wins++;
    const getPlayerName = () => name;
    const getPlayerType = () => type;
    const getPlayerSymbol = () => symbol;
    const getPlayerColor = () => color;
    const getPlayerWins = () => wins;

    return {
        getPlayerName, getPlayerType, getPlayerSymbol,
        getPlayerColor, getPlayerWins, countWins
    };
}

const playBoard = (() => {
    const writePlay = (player, boardSquare) => {
        if (checkValidPlay(boardSquare)) {
            boardSquare.textContent = player.getPlayerSymbol();
            boardSquare.style.color = player.getPlayerColor();
            gameBoard[parseInt(boardSquare.id.charAt(2))] = player.getPlayerName();
            checkWin(player);
        }
    }

    const checkWin = (player) => {
        if ((gameBoard[0] && gameBoard[1] && gameBoard[2]) ||
            (gameBoard[3] && gameBoard[4] && gameBoard[5]) ||
            (gameBoard[6] && gameBoard[7] && gameBoard[8]) ||
            (gameBoard[0] && gameBoard[3] && gameBoard[6]) ||
            (gameBoard[1] && gameBoard[4] && gameBoard[7]) ||
            (gameBoard[2] && gameBoard[5] && gameBoard[8]) ||
            (gameBoard[0] && gameBoard[4] && gameBoard[8]) ||
            (gameBoard[2] && gameBoard[4] && gameBoard[6])) {
            disableBoardPlay();
            player.countWins();
            winMessage(player);
        } else {
            alternatePlayer();
            playerTurnMessage();            
        }
    };

    const checkValidPlay = (boardSquare) => {
        return (gameBoard[parseInt(boardSquare.id.charAt(2))] == undefined)
    }

    return { writePlay };
})();

function enableBoardPLay() {
    const board = document.getElementsByClassName("boardSquare");
    Array.from(board).forEach(element => {
        element.addEventListener("click", playTurn);
    });
}

function disableBoardPlay() {
    const board = document.getElementsByClassName("boardSquare");
    Array.from(board).forEach(element => {
        element.removeEventListener("click", playTurn);
    });
}

function playTurn(e) {
    if (playerOneTurn) {
        playBoard.writePlay(playerList[0], e.target);
    } else {
        playBoard.writePlay(playerList[1], e.target);
    }
}


const lockPlayer = document.getElementsByClassName("lockPlayer");
Array.from(lockPlayer).forEach(element => {
    element.addEventListener("click", (e) => {
        if (e.target.textContent == "Lock-in") {
            lockPlayerData(e, element);
            if (playerOneLock && playerTwoLock) {
                Array.from(document.getElementsByClassName("controls_Container")[0].getElementsByTagName("button"))
                    .forEach(element => {
                        element.disabled = false;
                    });
                enableBoardPLay();
                randomizeFirst();
                playerTurnMessage();
            }
        } else {
            unlockPlayerData(e, element);
            Array.from(document.getElementsByClassName("controls_Container")[0].getElementsByTagName("button"))
                .forEach(element => {
                    element.disabled = true;
                });
            disableBoardPlay();
        }
    })
});

function getPlayerData(element) {
    let playerData = [];
    playerData.push(element.parentElement[0].value);
    playerData.push(element.parentElement[1].value);
    playerData.push(element.parentElement[2].value);
    playerData.push(element.parentElement[3].value);
    return playerData;
}

function lockPlayerData(event, element) {
    let playerData = getPlayerData(element);
    if (element.parentElement.className.endsWith("One_Container")) {
        playerOneLock = true;
        playerList[0] = playerFactory(playerData[0], playerData[1], playerData[2], playerData[3]);
    }
    if (element.parentElement.className.endsWith("Two_Container")) {
        playerTwoLock = true;
        playerList[1] = playerFactory(playerData[0], playerData[1], playerData[2], playerData[3]);
    }
    event.target.textContent = "Unlock";
    Array.from(element.parentElement.getElementsByTagName("input")).forEach(element => {
        element.disabled = true;
    });
    Array.from(element.parentElement.getElementsByTagName("select")).forEach(element => {
        element.disabled = true;
    });
}

function unlockPlayerData(event, element) {
    if (element.parentElement.className.endsWith("One_Container")) {
        playerOneLock = false;
    }
    if (element.parentElement.className.endsWith("Two_Container")) {
        playerTwoLock = false;
    }
    event.target.textContent = "Lock-in";
    Array.from(element.parentElement.getElementsByTagName("input")).forEach(element => {
        element.disabled = false;
    });
    Array.from(element.parentElement.getElementsByTagName("select")).forEach(element => {
        element.disabled = false;
    });
}

function randomizeFirst() {
    if (Math.round(Math.random()) == 0) {
        playerOneTurn = true;
    }
}

function playerTurnMessage() {
    if (playerOneTurn) {
        document.getElementsByClassName("player_Turn")[0].textContent = "It's "
            + playerList[0].getPlayerName() + " turn.";
        document.getElementsByClassName("player_Turn")[0].style.color = playerList[0].getPlayerColor();
    } else {
        document.getElementsByClassName("player_Turn")[0].textContent = "It's "
            + playerList[1].getPlayerName() + " turn.";
        document.getElementsByClassName("player_Turn")[0].style.color = playerList[1].getPlayerColor();
    }
}

function winMessage(player) {
    document.getElementsByClassName("player_Turn")[0].textContent = "It's OVER! "
        + player.getPlayerName() + " is victorious";
    document.getElementsByClassName("player_Turn")[0].style.color = player.getPlayerColor();
}

function alternatePlayer() {
    return playerOneTurn = !playerOneTurn;
}