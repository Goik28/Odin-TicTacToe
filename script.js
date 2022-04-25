const playerFactory = (name, type, symbol, color) => {
    let wins = 0;
    const countWins = () => wins++;
    const resetWins = () => wins = 0;
    const getPlayerName = () => name;
    const getPlayerType = () => type;
    const getPlayerSymbol = () => symbol;
    const getPlayerColor = () => color;
    const getPlayerWins = () => wins;

    return {
        getPlayerName, getPlayerType, getPlayerSymbol,
        getPlayerColor, getPlayerWins, countWins, resetWins
    };
}

const playBoard = (() => {
    let gameBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    let playerList = [];

    function enableBoardPLay() {
        const board = document.getElementsByClassName("boardSquare");
        Array.from(board).forEach(element => {
            element.addEventListener("click", controls.playerTurn);
        });
    }

    function disableBoardPlay() {
        const board = document.getElementsByClassName("boardSquare");
        Array.from(board).forEach(element => {
            element.removeEventListener("click", controls.playerTurn);
        });
    }

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
            messages.winMessage(player);
            score.incrementTotalMatches();
            score.updateScore();
        } else if (checkDraw()) {
            disableBoardPlay();
            messages.drawMessage();
            score.incrementTotalDraws();
            score.incrementTotalMatches();
            score.updateScore();
        } else {
            controls.alternatePlayer();
            messages.playerTurnMessage();
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

    return { playerList, writePlay, clearBoard, enableBoardPLay, disableBoardPlay };
})();

const score = (() => {
    let totalMatches = 0;
    const incrementTotalMatches = () => totalMatches++;
    const getTotalMatches = () => totalMatches;

    let totalDraws = 0;
    const incrementTotalDraws = () => totalDraws++;
    const getTotalDraws = () => totalDraws;

    const updateScore = () => {
        document.getElementsByClassName("totalMatches")[0].textContent = "Total games player: " + getTotalMatches();
        document.getElementsByClassName("playerOne_Wins")[0].textContent = "Player 1 wins: " + playBoard.playerList[0].getPlayerWins();
        document.getElementsByClassName("playerOne_Wins")[0].style.color = "" + playBoard.playerList[0].getPlayerColor();
        document.getElementsByClassName("playerTwo_Wins")[0].textContent = "Player 2 wins: " + playBoard.playerList[1].getPlayerWins();
        document.getElementsByClassName("playerTwo_Wins")[0].style.color = "" + playBoard.playerList[1].getPlayerColor();
        document.getElementsByClassName("totalDraws")[0].textContent = "Draws: " + getTotalDraws();
    }

    const resetScore = () => {
        document.getElementsByClassName("totalMatches")[0].textContent = "Total games player: ";
        document.getElementsByClassName("playerOne_Wins")[0].textContent = "Player 1 wins: ";
        document.getElementsByClassName("playerOne_Wins")[0].style.color = "#FFFFFF";
        playBoard.playerList[0].resetWins();
        document.getElementsByClassName("playerTwo_Wins")[0].textContent = "Player 2 wins: ";
        playBoard.playerList[1].resetWins();
        document.getElementsByClassName("playerTwo_Wins")[0].style.color = "#FFFFFF";
        document.getElementsByClassName("totalDraws")[0].textContent = "Draws: "
    }

    return { incrementTotalMatches, incrementTotalDraws, updateScore, resetScore };
})();

const controls = (() => {
    let playerOneTurn = false;

    const enableControls = () => {
        Array.from(document.getElementsByClassName("controls_Container")[0].getElementsByTagName("button"))
            .forEach(element => {
                element.disabled = false;
            });
        document.getElementById("newMatch").addEventListener("click", newMatch);
        document.getElementById("resetScore").addEventListener("click", score.resetScore);
    }

    const disableControls = () => {
        Array.from(document.getElementsByClassName("controls_Container")[0].getElementsByTagName("button"))
            .forEach(element => {
                element.disabled = true;
            });
        document.getElementById("newMatch").removeEventListener("click", newMatch);
        document.getElementById("resetScore").removeEventListener("click", score.resetScore);
    }

    const newMatch = () => {
        playBoard.clearBoard();
        playBoard.enableBoardPLay();
        randomizeFirst();
        messages.playerTurnMessage();
    }

    const randomizeFirst = () => {
        if (Math.round(Math.random()) == 0) {
            playerOneTurn = true;
        } else {
            playerOneTurn = false;
        }
    }

    const playerTurn = (event) => {
        if (playerOneTurn) {
            playBoard.writePlay(playBoard.playerList[0], event.target);
        } else {
            playBoard.writePlay(playBoard.playerList[1], event.target);
        }
    }

    const alternatePlayer = () => {
        return playerOneTurn = !playerOneTurn;
    }

    const getPlayerTurn = () => { playerOneTurn; }

    return { enableControls, disableControls, newMatch, playerTurn, getPlayerTurn, alternatePlayer }
})();

const messages = (() => {
    const playerTurnMessage = () => {
        if (controls.getPlayerTurn()) {
            document.getElementsByClassName("player_Turn")[0].textContent = "It's "
                + playBoard.playerList[0].getPlayerName() + " turn.";
            document.getElementsByClassName("player_Turn")[0].style.color = playBoard.playerList[0].getPlayerColor();
        } else {
            document.getElementsByClassName("player_Turn")[0].textContent = "It's "
                + playBoard.playerList[1].getPlayerName() + " turn.";
            document.getElementsByClassName("player_Turn")[0].style.color = playBoard.playerList[1].getPlayerColor();
        }
    }

    const winMessage = (player) => {
        document.getElementsByClassName("player_Turn")[0].textContent = "It's OVER! "
            + player.getPlayerName() + " is victorious";
        document.getElementsByClassName("player_Turn")[0].style.color = player.getPlayerColor();
    }

    const drawMessage = () => {
        document.getElementsByClassName("player_Turn")[0].textContent = "It's a DRAW! Click New Match to restart.";
        document.getElementsByClassName("player_Turn")[0].style.color = "#A216A2";
    }

    return { playerTurnMessage, winMessage, drawMessage }
})();

const initiate = (() => {
    let playerOneLock = false;
    let playerTwoLock = false;

    const protectPlayerSymbols = () => {
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

    const lockPlayerData = (event, element) => {
        let playerData = getPlayerData(element);
        if (element.parentElement.className.endsWith("One_Container")) {
            playerOneLock = true;
            playBoard.playerList[0] = playerFactory(playerData[0], playerData[1], playerData[2], playerData[3]);
        }
        if (element.parentElement.className.endsWith("Two_Container")) {
            playerTwoLock = true;
            playBoard.playerList[1] = playerFactory(playerData[0], playerData[1], playerData[2], playerData[3]);
        }
        event.target.textContent = "Unlock";
        Array.from(element.parentElement.getElementsByTagName("input")).forEach(element => {
            element.disabled = true;
        });
        Array.from(element.parentElement.getElementsByTagName("select")).forEach(element => {
            element.disabled = true;
        });
    }

    const getPlayerData = (element) => {
        let playerData = [];
        playerData.push(element.parentElement[0].value);
        playerData.push(element.parentElement[1].value);
        playerData.push(element.parentElement[2].value);
        playerData.push(element.parentElement[3].value);
        return playerData;
    }

    const unlockPlayerData = (event, element) => {
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

    const readyGame = () => {
        protectPlayerSymbols();
        Array.from(document.getElementsByClassName("lockPlayer")).forEach(element => {
            element.addEventListener("click", (e) => {
                if (e.target.textContent == "Lock-in") {
                    lockPlayerData(e, element);
                    if (playerOneLock && playerTwoLock) {
                        controls.enableControls();
                        controls.newMatch();
                        playBoard.enableBoardPLay();
                        messages.playerTurnMessage();
                    }
                } else {
                    unlockPlayerData(e, element);
                    controls.disableControls();
                    playBoard.disableBoardPlay();
                    playBoard.clearBoard();
                    score.resetScore();
                    document.getElementsByClassName("player_Turn")[0].textContent = "";
                }
            })
        });
    }

    return { readyGame }
})();

initiate.readyGame();