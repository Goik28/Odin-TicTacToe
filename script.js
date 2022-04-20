let playerFactory = (name, type, symbol, color) => {
    const name = name;
    const type = type;
    const symbol = symbol;
    const color = color;
    const wins = 0;

    const countWins = () => {
        this.wins++;
    }

    const getPlyerName = () => this.name;
    const getPlyerType = () => this.type;
    const getPlyerSymbol = () => this.symbol;
    const getPlyerColor = () => this.color;
    const getPlyerWins = () => this.wins;

    return {getPlyerName, getPlyerType, getPlyerSymbol,
        getPlyerColor, getPlyerWins};
}

