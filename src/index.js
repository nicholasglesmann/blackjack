import Deck from './Deck.js';
import Hand from './Hand.js';
import UI from './UI.js';

class Game {
    constructor() {

        ////////// Class Variables \\\\\\\\\\
        this.gameDeck = {};

        this.dealerHand = {};
        this.playerHand = {};

        this.playerCash = 1000;
        this.playerCurrentBet = 0;
        this.playerBetValue = 50;

        this.dealerScorePrintQueue = [];

        this.Actions = ["hit", "stand", "surrender"];

        ////////// Method Bindings \\\\\\\\\\
        this.mainGameLoop = this.mainGameLoop.bind(this);
        this.newHand = this.newHand.bind(this);
        this.dealInitialCards = this.dealInitialCards.bind(this);
        this.hitClick = this.hitClick.bind(this);
        this.standClick = this.standClick.bind(this);
        this.surrenderClick = this.surrenderClick.bind(this);
        this.betClick = this.betClick.bind(this);
        this.increaseBet = this.increaseBet.bind(this);
        this.decreaseBet = this.decreaseBet.bind(this);
        this.dealerPlay = this.dealerPlay.bind(this);
        this.updateMoney = this.updateMoney.bind(this);
        this.checkGameOver = this.checkGameOver.bind(this);

        ////////// Initial Methods \\\\\\\\\\
        UI.setOnDeckStyle();
        UI.setUpCardLocations();
        this.addEventListeners();
        this.mainGameLoop();
    }

    ////////// Initial Methods \\\\\\\\\\
    addEventListeners() {
        document.getElementById("hit").addEventListener("click", () => { this.hitClick(); });
        document.getElementById("stand").addEventListener("click", () => { this.standClick(); });
        document.getElementById("surrender").addEventListener("click", () => { this.surrenderClick(); });
        document.getElementById("bet").addEventListener("click", () => { this.betClick(); });
        document.getElementById("downArrow").addEventListener("click", () => { this.decreaseBet(); });
        document.getElementById("upArrow").addEventListener("click", () => { this.increaseBet(); });
    }

    ////////// New Hand Methods \\\\\\\\\\
    newHand() {
        this.gameDeck = new Deck(52);
        this.gameDeck.shuffleDeck();

        this.playerHand = new Hand();
        this.dealerHand = new Hand();

        this.dealInitialCards();
    }

    dealInitialCards() {
        for (let i = 0; i < 2; i++) {
            let playerCardLocation = UI.getPlayerFrontCardLocation(i);
            let dealerCardLocation = UI.getDealerFrontCardLocation(i);

            let playerCard = this.gameDeck.dealCard();
            let dealerCard = this.gameDeck.dealCard();

            this.playerHand.addCard(playerCard);
            this.dealerHand.addCard(dealerCard);

            UI.printCard(playerCardLocation, playerCard.getFileName());
            UI.printCard(dealerCardLocation, dealerCard.getFileName());
        }
    }

    mainGameLoop() {
        UI.setUpHand(this.playerCash, this.playerBetValue);
        this.newHand();
        UI.disableActions();
        this.checkGameOver();
        UI.enableBetting();
    }

    increaseBet() {
        if (UI.isBettingDisabled) {
            return;
        }

        //get current bet ammount        
        let betSelection = document.getElementById("playerBetSelection");
        let betAmount = Number(betSelection.innerHTML.substring(1));

        //check that player has enough to bet
        if (betAmount + 50 <= this.playerCash) {
            betAmount += 50;
        } else {
            betAmount = this.playerCash;
        }

        //print updated bet ammount
        betSelection.innerHTML = "$" + betAmount;
    }

    decreaseBet() {
        if (UI.isBettingDisabled) {
            return;
        }

        //get current bet ammount
        let betSelection = document.getElementById("playerBetSelection");
        let betAmount = Number(betSelection.innerHTML.substring(1));

        //check that bet ammount is not less than 50
        if (betAmount - 50 >= 50) {
            betAmount -= 50;
        } else {
            betAmount = Number(50);
        }

        //print updated bet ammount
        betSelection.innerHTML = "$" + betAmount;
    }

    ////////// Click Methods \\\\\\\\\\
    hitClick() {
        let cardIndex = this.playerHand.getCardCount();
        let cardFrontLocation = UI.getPlayerFrontCardLocation(cardIndex);
        let cardBackLocation = UI.getPlayerBackCardLocation(cardIndex);

        let card = this.gameDeck.dealCard();

        this.playerHand.addCard(card);

        let score = this.playerHand.getScore();

        UI.placeCard(cardBackLocation);
        UI.printCard(cardFrontLocation, card.getFileName());
        UI.flipCard(cardFrontLocation);
        UI.printPlayerScore(score);

        //if score over 21, hand over
        if (score > 21) {
            this.playerBust();
        }
    }

    standClick() {
        UI.disableActions();
        this.dealerPlay();
    }

    surrenderClick() {
        this.playerBust();
    }

    betClick() {
        UI.disableBetting();
        UI.enableActions();
        UI.flipInitialCards();

        UI.printPlayerScore(this.playerHand.getScore());
        UI.printDealerScore(this.dealerHand.getPartialDealerScore());

        //get the players bet and subtract it from the players cash
        this.playerCurrentBet = document.getElementById("playerBetSelection").innerHTML.substring(1);
        this.playerCash -= Number(this.playerCurrentBet);
        this.updateMoney();
    }

    ////////// Score Methods \\\\\\\\\\
    compareScores() {
        let playerScore = this.playerHand.getScore();
        let dealerScore = this.dealerHand.getScore();

        if (dealerScore > 21) {
            this.dealerBust();
        } else if (dealerScore > playerScore) {
            this.dealerWin();
        } else if (dealerScore < playerScore) {
            this.playerWin();
        } else if (dealerScore === playerScore) {
            this.playerPush();
        }
    }

    ////////// Finish Round Methods \\\\\\\\\\
    playerBust() {
        console.log("player bust");
        this.dealerWin();
    }

    dealerBust() {
        console.log("dealer bust");
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
        UI.disableActions();

        //clear variables
        this.gameDeck = {};

        this.dealerHand = new Hand();
        this.playerHand = new Hand();

        this.playerCurrentBet = 0;
        this.dealerScorePrintQueue = [];
        this.updateMoney();
        UI.removeAllCards();
        this.mainGameLoop();
    }

    checkGameOver() {
        if (this.playerCash <= 0) {
            let bodySelector = document.getElementsByTagName("body");
            let body = bodySelector[0];
            let allElements = document.getElementsByTagName("*");
            for (let i = 0; i < allElements.length; i++) {
                allElements[i].classList.add("hidden");
            }
            body.classList.remove("hidden");
            body.classList.add("gameOver");
        }
    }

    ////////// Update Screen Methods \\\\\\\\\\
    updateMoney() {
        document.getElementById("playerBet").innerHTML = "Current Bet: $" + this.playerCurrentBet;
        document.getElementById("playerCash").innerHTML = "Total Cash: $" + this.playerCash;
    }

    ////////// Dealer Methods \\\\\\\\\\
    dealerPlay() {
        let printDelay = 1500;
        let printPosition = 0;

        // reveal the initial card
        let startingCardLocation = UI.getDealerFrontCardLocation(0);
        let startingCard = this.dealerHand.getCard(0);
        UI.printCard(startingCardLocation, startingCard.getFileName());
        UI.printDealerScore(this.dealerHand.getScore());
        UI.flipCard(startingCardLocation);

        while (this.dealerHand.getScore() <= 17) {
            //get the new card position
            let cardLocation = UI.getDealerFrontCardLocation(this.dealerHand.getCardCount());

            //deal a card
            let card = this.gameDeck.dealCard();

            this.dealerHand.addCard(card);

            //delay printing image/score to the screen
            setTimeout(() => {
                UI.printCard(cardLocation, card.getFileName());

                //print dealer score to the screen
                document.getElementById("dealerScore").innerText = this.dealerScorePrintQueue[printPosition];
                printPosition++;

            }, printDelay, printPosition);

            //update dealerScorePrintQueue array for delayed score printing
            this.dealerScorePrintQueue.push(this.dealerHand.getScore());

            //add 1000 ms between each image/score print
            printDelay += 1000;
        }

        printDelay += 1000;
        setTimeout(() => { this.compareScores(); }, printDelay);
    }
}


let game;
window.addEventListener('load', () => game = new Game());