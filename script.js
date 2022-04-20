const playerFactory = (name, type, symbol, color) => {
    let wins = 0;
    const countWins = () => wins++;
    const getPlyerName = () => name;
    const getPlyerType = () => type;
    const getPlyerSymbol = () => symbol;
    const getPlyerColor = () => color;
    const getPlyerWins = () => wins;

    return {
        getPlyerName, getPlyerType, getPlyerSymbol,
        getPlyerColor, getPlyerWins, countWins
    };
}

const playBoard = (() => {
    const writePlay = (player, symbol, color, boardSquare) => {
        boardSquare.textContent = symbol;
        boardSquare.style("color") = color;
        //matrix = player at position
    }
    return { writePlay };
})();

const board = document.getElementsByClassName("boardSquare");
/*
Array.from(board).forEach(element => {
    element.addEventListener("click",)
});*/

const lockPlayer = document.getElementsByClassName("lockPlayer");

Array.from(lockPlayer).forEach(element => {
    element.addEventListener("click", (e) => {
        if (e.target.textContent == "Lock-in") {
            let playerData = new FormData(element.parentElement);
            playerFactory(playerData[0], playerData[1], playerData[2], playerData[3]);
            e.target.textContent = "Unlock";
            Array.from(element.parentElement.getElementsByTagName("input")).forEach(element => {
                element.disabled = true;
            });
            e.target.disabled = false;
        } else{
            e.target.textContent = "Lock-in";
            Array.from(element.parentElement.getElementsByTagName("input")).forEach(element => {
                element.disabled = false;
            });
        }
    })
});