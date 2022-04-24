let playerList = [];
let playerOneLock = false;
let playerTwoLock = false;
let playerOneTurn = false;

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
    let gameBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    const writePlay = (player, boardSquare) => {
        if (checkValidPlay(boardSquare)) {
            boardSquare.textContent = player.getPlayerSymbol();
            boardSquare.style.color = player.getPlayerColor();
            gameBoard[parseInt(boardSquare.id.charAt(2))] = player.getPlayerName();
            check(player);
        }
    }

    const check = (player) => {
        if (checkWin(player)) {
            disableBoardPlay();
            player.countWins();
            winMessage(player);
        } else if (checkDraw()) {
            disableBoardPlay();
            drawMessage();
        } else {
            alternatePlayer();
            playerTurnMessage();
        }
    }

    const checkValidPlay = (boardSquare) => {
        return (typeof (gameBoard[parseInt(boardSquare.id.charAt(2))]) == "number")
    }

    const checkDraw = () => {
        return (gameBoard.every(element => {
           return typeof (element) == "string";
        }));
    }

    const checkWin = (player) => {
        if ((gameBoard[0] == gameBoard[1] && gameBoard[0] == gameBoard[2]) ||
            (gameBoard[3] == gameBoard[4] && gameBoard[3] == gameBoard[5]) ||
            (gameBoard[6] == gameBoard[7] && gameBoard[6] == gameBoard[8]) ||
            (gameBoard[0] == gameBoard[3] && gameBoard[0] == gameBoard[6]) ||
            (gameBoard[1] == gameBoard[4] && gameBoard[1] == gameBoard[7]) ||
            (gameBoard[2] == gameBoard[5] && gameBoard[2] == gameBoard[8]) ||
            (gameBoard[0] == gameBoard[4] && gameBoard[0] == gameBoard[8]) ||
            (gameBoard[2] == gameBoard[4] && gameBoard[2] == gameBoard[6])) {
            return true;
        }
    }

    const clearBoard = () => {
        gameBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        Array.from(document.getElementsByClassName("boardSquare")).forEach(element => {
            element.textContent = "";
        });
    }

    return { writePlay, clearBoard };
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

function newMatch() {
    playBoard.clearBoard();
    enableBoardPLay();
    randomizeFirst();
    playerTurnMessage();
}

function enableControls() {
    Array.from(document.getElementsByClassName("controls_Container")[0].getElementsByTagName("button"))
        .forEach(element => {
            element.disabled = false;
        });
    document.getElementById("newMatch").addEventListener("click", newMatch);
}

function disableControls() {
    Array.from(document.getElementsByClassName("controls_Container")[0].getElementsByTagName("button"))
        .forEach(element => {
            element.disabled = true;
        });
    document.getElementById("newMatch").removeEventListener("click", newMatch);
}

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

{//Ready the game when both players are locked.
    const lockPlayer = document.getElementsByClassName("lockPlayer");
    Array.from(lockPlayer).forEach(element => {
        element.addEventListener("click", (e) => {
            if (e.target.textContent == "Lock-in") {
                lockPlayerData(e, element);
                if (playerOneLock && playerTwoLock) {
                    enableControls();
                    newMatch();
                    enableBoardPLay();
                    randomizeFirst();
                    playerTurnMessage();
                }
            } else {
                unlockPlayerData(e, element);
                disableControls();
                disableBoardPlay();
                playBoard.clearBoard();
                document.getElementsByClassName("player_Turn")[0].textContent = "";
            }
        })
    });
}

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

function drawMessage() {
    document.getElementsByClassName("player_Turn")[0].textContent = "It's a DRAW! Click New Match to restart.";
    document.getElementsByClassName("player_Turn")[0].style.color = "#A216A2";
}

function alternatePlayer() {
    return playerOneTurn = !playerOneTurn;
}