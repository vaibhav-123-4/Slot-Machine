const prompt = require("prompt-sync")();

const rows = 3, cols = 3;
const symbolsCount = {
    "A": 2,
    "B": 4,
    "C": 6,
    "D": 8
};
const symbolsValue = {
    "A": 5,
    "B": 4,
    "C": 3,
    "D": 2
};

const deposit = () => {
    while (true) {
        const depositAmount = prompt("Enter a deposit amount: ");
        const numberDepositAmount = parseFloat(depositAmount);
        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log("Invalid Deposit Amount! ");
        } else {
            return numberDepositAmount;
        }
    }
};

const getNumberOfLines = () => {
    while (true) {
        const lines = prompt("Enter number of lines (1-3): ");
        const numberLines = parseFloat(lines);
        if (isNaN(numberLines) || numberLines <= 0 || numberLines > 3) {
            console.log("Invalid number of lines! ");
        } else {
            return numberLines;
        }
    }
};

const getBet = (balance, lines) => {
    while (true) {
        const bet = prompt("Enter the bet per line: ");
        const numberBet = parseFloat(bet);
        if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {
            console.log("Invalid Bet! ");
        } else {
            return numberBet;
        }
    }
};

const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(symbolsCount)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }
    const reels = [[], [], []];
    for (let i = 0; i < cols; i++) {
        const reelSymbols = [...symbols];
        for (let j = 0; j < rows; j++) {
            const randIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randIndex, 1);
        }
    }
    return reels;
};

const transpose = (reels) => {
    const transposedRows = [];
    for (let i = 0; i < rows; i++) {
        transposedRows.push([]);
        for (let j = 0; j < cols; j++) {
            transposedRows[i].push(reels[j][i]);
        }
    }
    return transposedRows;
};

const printRows = (rows) => {
    for (const row of rows) {
        console.log(row.join(" | "));
    }
};

const getWinnings = (rows, bet, lines) => {
    let winnings = 0;
    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;
        for (const symbol of symbols) {
            if (symbol !== symbols[0]) {
                allSame = false;
                break;
            }
        }
        if (allSame) {
            winnings += bet * symbolsValue[symbols[0]];
        }
    }
    return winnings;
};

const game = () => {
    let balance = deposit();
    while (true) {
        console.log("Your current balance is: $" + balance);
        const numberLines = getNumberOfLines();
        const bet = getBet(balance, numberLines);

        balance -= bet * numberLines;

        const reels = spin();
        const rows = transpose(reels);

        console.log("Slot Machine Results:");
        printRows(rows);

        const winnings = getWinnings(rows, bet, numberLines);
        balance += winnings;

        console.log("You won $" + winnings.toString());
        console.log("Your new balance is: $" + balance);

        if (balance <= 0) {
            console.log("You ran out of money! Game over.");
            break;
        }

        const playAgain = prompt("Do you want to play again? (y/n): ");
        if (playAgain.toLowerCase() !== 'y') {
            console.log("Thank you for playing! Your final balance is $" + balance);
            break;
        }
    }
};

game();
