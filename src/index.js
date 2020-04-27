class Game {
    constructor() {

        ////////// Class Variables \\\\\\\\\\
        this.gameDeck = {};
        
        this.dealerCards = [];
        this.playerCards = [];

        this.dealerScore = 0;
        this.playerScore = 0;

        this.playerCash = 1000;
        this.playerCurrentBet = 0;
        this.playerBetValue = 50;

        this.printDealerScores = [];

        this.actionButtons = ["hit", "stand", "surrender"];

        ////////// Method Bindings \\\\\\\\\\
        this.mainGameLoop = this.mainGameLoop.bind(this);
        this.newHand = this.newHand.bind(this);
        this.playerBet = this.playerBet.bind(this);
        this.hitClick = this.hitClick.bind(this);
        this.standClick = this.standClick.bind(this);
        this.surrenderClick = this.surrenderClick.bind(this);
        this.betClick = this.betClick.bind(this);
        this.increaseBet = this.increaseBet.bind(this);
        this.decreaseBet = this.decreaseBet.bind(this);
        this.disableButton = this.disableButton.bind(this);
        this.disableActionButtons = this.disableActionButtons.bind(this);
        this.enableButton = this.enableButton.bind(this);
        this.enableActionButtons = this.enableActionButtons.bind(this);
        this.dealerPlay = this.dealerPlay.bind(this);
        this.sumDealerScore = this.sumDealerScore.bind(this);
        this.updateMoney = this.updateMoney.bind(this);
        this.checkGameOver = this.checkGameOver.bind(this);

        ////////// Initial Methods \\\\\\\\\\
        this.addEventListeners();
        this.mainGameLoop();
    }

    ////////// Initial Methods \\\\\\\\\\
    addEventListeners() {
        document.getElementById("hit").addEventListener("click", () => { this.hitClick(); });
        document.getElementById("stand").addEventListener("click", () => { this.standClick(); });
        document.getElementById("surrender").addEventListener("click", () => { this.surrenderClick(); });
        document.getElementById("bet").addEventListener("click", () => { this.betClick(); });
    }


    ////////// New Hand Methods \\\\\\\\\\
    newHand() {
        //create new deck and shuffle it
        this.gameDeck = new Deck(52);
        this.gameDeck.shuffleDeck();

        //get initial card positions
        let newPlayerCardPosition = document.getElementById("player0");
        let newDealerCardPosition = document.getElementById("dealer0");

        //deal initial cards
        let newPlayerCard = this.gameDeck.dealCard();
        let newDealerCard = this.gameDeck.dealCard();

        //add initial cards to correct arrays
        this.playerCards.push(newPlayerCard);
        this.dealerCards.push(newDealerCard);

        //print the images to the screen
        let newPlayerCardName = newPlayerCard.getCardFilename();
        let newDealerCardName = newDealerCard.getCardFilename();
        newPlayerCard.setCardImage(newPlayerCardPosition, newPlayerCardName);
        newDealerCard.setCardImage(newDealerCardPosition, newDealerCardName);

        //update scores
        this.sumPlayerScore(this.playerCards);
        document.getElementById("playerScore").innerText = this.playerScore;

        this.sumDealerScore(this.dealerCards);
        document.getElementById("dealerScore").innerText = this.dealerScore;
    }

    mainGameLoop() {
        document.getElementById("playerScore").innerText = 0;
        document.getElementById("dealerScore").innerText = 0;
        document.getElementById("playerCash").innerHTML = "Total Cash: $" + this.playerCash;
        document.getElementById("dealer0").setAttribute("src", "./images/cards/blue_back.png");
        document.getElementById("player0").setAttribute("src", "./images/cards/blue_back.png");
        document.getElementById("playerBetSelection").innerHTML = "$" + this.playerBetValue;
        this.disableActionButtons();
        this.checkGameOver();
        this.playerBet()
    }

    playerBet() {
        document.getElementById("downArrow").addEventListener("click", this.decreaseBet);
        document.getElementById("upArrow").addEventListener("click", this.increaseBet);
        document.getElementById("bet").removeAttribute("disabled");
    }

    increaseBet() {
        //get current bet ammount        
        let betSelection = document.getElementById("playerBetSelection");
        let betAmount = Number(betSelection.innerHTML.substring(1));
        
        //check that player has enough to bet
        if(betAmount + 50 <= this.playerCash) {
            betAmount += 50;
        } else {
            betAmount = this.playerCash;
        }

        //print updated bet ammount
        betSelection.innerHTML = "$" + betAmount;
    }

    decreaseBet() {
        //get current bet ammount
        let betSelection = document.getElementById("playerBetSelection");
        let betAmount = Number(betSelection.innerHTML.substring(1));
        
        //check that bet ammount is not less than 50
        if(betAmount - 50 >= 50) {
            betAmount -= 50;
        } else {
            betAmount = Number(50);
        }

        //print updated bet ammount
        betSelection.innerHTML = "$" + betAmount;
    }

    ////////// Click Methods \\\\\\\\\\
    hitClick() {
        //get the new card position
        let newCardPosition = document.getElementById("player" + this.playerCards.length);

        //deal a card
        let newCard = this.gameDeck.dealCard();

        //add card to playerCards array
        this.playerCards.push(newCard);

        //print card image to the screen
        let newCardName = newCard.getCardFilename();
        newCard.setCardImage(newCardPosition, newCardName);

        //print player score to the screen
        this.sumPlayerScore(this.playerCards);
        document.getElementById("playerScore").innerText = this.playerScore;

        //if score over 21, hand over
        if(this.playerScore > 21) {
            this.playerBust();
        }
    }

    standClick() {
        this.disableActionButtons();
        this.dealerPlay();
    }

    surrenderClick() {
        this.playerBust();
    }

    betClick() {
        //disable bet buttons
        document.getElementById("downArrow").removeEventListener("click", this.decreaseBet);
        document.getElementById("upArrow").removeEventListener("click", this.increaseBet);
        document.getElementById("bet").setAttribute("disabled", "true");

        //enable action buttons
        this.enableActionButtons();

        //get the players bet and subtract it from the players cash
        this.playerCurrentBet = document.getElementById("playerBetSelection").innerHTML.substring(1);
        this.playerCash -= Number(this.playerCurrentBet);
        this.updateMoney();

        this.newHand();
    }

    ////////// Score Methods \\\\\\\\\\
    sumPlayerScore(cards) {
        let sum = 0;
        for (let i = 0; i < cards.length; i++) {
            sum += cards[i].getValue(this.playerScore);
        }
        this.playerScore = sum;
    }

    sumDealerScore(cards) {
        let sum = 0;
        for (let i = 0; i < cards.length; i++) {
            sum += cards[i].getValue(this.dealerScore);
        }
        this.dealerScore = sum;
    }

    compareScores() {
        if(this.dealerScore > 21) {
            this.dealerBust();
        } else if (this.dealerScore > this.playerScore) {
            this.dealerWin();
        } else if (this.dealerScore < this.playerScore) {
            this.playerWin();
        } else if (this.dealerScore === this.playerScore) {
            this.playerPush();
        }
    }

    ////////// Finish Round Methods \\\\\\\\\\
    playerBust() {
        console.log("player bust");
        this.disableActionButtons();
        this.dealerWin();
    }

    dealerBust() {
        console.log("dealer bust");
        this.disableActionButtons();
        this.playerWin();
    }

    playerPush() {
        this.endHand();
    }

    playerWin() {
        this.playerCash += (Number(this.playerCurrentBet) * 2);
        this.endHand();
    }

    dealerWin() {
        this.endHand();
    }

    endHand() {
        //clear variables
        this.gameDeck = {};

        this.dealerCards = [];
        this.playerCards = [];

        this.dealerScore = 0;
        this.playerScore = 0;

        this.playerCurrentBet = 0;
        this.printDealerScores = [];
        this.updateMoney();
        this.removeAllCards();
        this.mainGameLoop();
    }

    checkGameOver() {
        if(this.playerCash <= 0) {
            let bodySelector = document.getElementsByTagName("body");
            let body = bodySelector[0];
            let allElements = document.getElementsByTagName("*");
            for (let i=0; i < allElements.length; i++) {
                allElements[i].classList.add("hidden");
            }
            body.classList.remove("hidden");
            body.classList.add("gameOver");
        }
    }

    ////////// Button Enable/Disable Methods \\\\\\\\\\
    disableButton(buttonName) {
        document.getElementById(buttonName).setAttribute("disabled", "true");
    }

    disableActionButtons() {
        for(let i = 0; i < this.actionButtons.length; i++) {
            this.disableButton(this.actionButtons[i]);
        }
    }

    enableButton(buttonName) {
        document.getElementById(buttonName).removeAttribute("disabled");
    }

    enableActionButtons() {
        for(let i = 0; i < this.actionButtons.length; i++) {
            this.enableButton(this.actionButtons[i]);
        }
    }

    ////////// Update Screen Methods \\\\\\\\\\
    updateMoney() {
        document.getElementById("playerBet").innerHTML = "Current Bet: $" + this.playerCurrentBet;
        document.getElementById("playerCash").innerHTML = "Total Cash: $" + this.playerCash;
    }

    removeAllCards() {
        for(let i = 1; i <= 5; i++) {
            let playerCard = "player" + i;
            let dealerCard = "dealer" + i;
            document.getElementById(playerCard).removeAttribute("src");
            document.getElementById(dealerCard).removeAttribute("src");
        }
    }

    ////////// Dealer Methods \\\\\\\\\\
    dealerPlay() {
        let printDelay = 500;
        let printPosition = 0;

        while(this.dealerScore <= 17) {
            //get the new card position
            let newCardPosition = document.getElementById("dealer" + this.dealerCards.length);

            //deal a card
            let newCard = this.gameDeck.dealCard();

            //add card to dealerCards array
            this.dealerCards.push(newCard);

            //delay printing image/score to the screen
            setTimeout(() => {

            //print card image to the screen
            let newCardName = newCard.getCardFilename();
            newCard.setCardImage(newCardPosition, newCardName);

            //print dealer score to the screen
            document.getElementById("dealerScore").innerText = this.printDealerScores[printPosition];
            printPosition++;

            }, printDelay, printPosition);

            //update printdealerscores array
            this.sumDealerScore(this.dealerCards)
            this.printDealerScores.push(this.dealerScore);

            //add 1000 ms between each image/score print
            printDelay += 1000;
        }
        
        printDelay += 1000;
        setTimeout(() => { this.compareScores(); }, printDelay);
    }
}

class Card {
    constructor(suit, value) {

        ////////// Class Variables \\\\\\\\\\
        this.suits = ["Hearts", "Clubs", "Spades", "Diamonds"];
        this.values = ["?", "A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"];

        this.suit = this.suits[suit];
        this.nameValue = this.values[value];
        this.numberValue = value;

        ////////// Method Bindings \\\\\\\\\\
        this.getValue = this.getValue.bind(this);
        this.getCardFilename = this.getCardFilename.bind(this);
        this.hasMatchingValue = this.hasMatchingValue.bind(this);
    }

    getValue(currentTotal) {
        if(this.numberValue > 1 && this.numberValue < 10) {
            return this.numberValue;
        } else if(this.numberValue >= 10) {
            return 10;
        } else if(this.numberValue === 1 && currentTotal + 11 > 21) {
            return 1;
        } else if (this.numberValue === 1 && currentTotal + 11 <= 21) {
            return 11;
        }
    }

    getCardFilename() {
        let suitLetter = this.suit.charAt(0);
        return this.nameValue + suitLetter;
    }

    setCardImage(cardLocation, cardName) {
        //set the src attribute of the image element "cardLocation" to "cardName.png"
        cardLocation.setAttribute("src", "./images/cards/" + cardName + ".png");
    }

    hasMatchingValue(cardValue) {
        if (this.nameValue === cardValue)
            return true;
        return false;
    }
}

class Deck {
    constructor(numOfCards) {

        ////////// Class Variables \\\\\\\\\\
        this.deck = this.createDeck(numOfCards);

        ////////// Method Bindings \\\\\\\\\\
        this.createDeck = this.createDeck.bind(this);
        this.shuffleDeck = this.shuffleDeck.bind(this);
        this.dealCard = this.dealCard.bind(this);
    }

    createDeck(numOfCards) {
        let newDeck = [];
        for (let suit = 0; suit <= 3; suit++)
        {
            for (let value = 1; value <= 13; value++)
            {
                let c = new Card(suit, value);
                newDeck.push(c);
            }
        }
        return newDeck;
    }

    shuffleDeck() {
        for (let j = 0; j < this.deck.length - 1; j++)
        {
            for (let i = 0; i < this.deck.length - 1; i++)
            {
                let randomIndex = Math.floor(Math.random() * 52);
                let tempCard = this.deck[randomIndex];
                this.deck[randomIndex] = this.deck[i];
                this.deck[i] = tempCard;
            }
        }
    }

    dealCard() {
        if(this.deck.length > 0)
            return this.deck.pop();
        else
            console.log("Deal Card Error.");
    }
}

let game;
window.addEventListener('load', () => game = new Game());