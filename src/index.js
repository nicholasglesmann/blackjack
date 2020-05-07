import Deck from './Deck.js';
import Hand from './Hand.js';
import UI from './UI.js';
import Text from './Text.js';
import Time from './Time.js';

class Game {
    constructor() {
        ////////// Class Variables \\\\\\\\\\
        this.gameDeck = {};

        this.dealerHand = {};
        this.playerHand = {};

        this.playerCash = 1000;
        this.playerCurrentBet = 0;
        this.playerBetValue = 100;

        this.handsPlayed = 0;

        this.isPlaying = false;

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
        this.isGameOver = this.isGameOver.bind(this);

        this.startGame();
    }

    ////////// Initial Methods \\\\\\\\\\
    startGame() {
        UI.displayModalMessage(Text.welcome, Time.medium);
        UI.displayModalMessage(Text.placeBet, Time.long);
        UI.setOnDeckStyle();
        UI.setUpCardContainers();
        this.addEventListeners();

        this.gameDeck = new Deck(52);

        this.playerHand = new Hand();
        this.dealerHand = new Hand();

        this.mainGameLoop();
    }

    addEventListeners() {
        document.getElementById("hit").addEventListener("click", () => { this.hitClick(); });
        document.getElementById("stand").addEventListener("click", () => { this.standClick(); });
        document.getElementById("surrender").addEventListener("click", () => { this.surrenderClick(); });
        document.getElementById("bet").addEventListener("click", () => { this.betClick(); });
        document.getElementById("downArrow").addEventListener("click", () => { this.decreaseBet(); });
        document.getElementById("upArrow").addEventListener("click", () => { this.increaseBet(); });
    }

    mainGameLoop() {
        this.playerBetValue = this.playerCash < 100 ? 50 : 100;

        if (this.isGameOver()) {
            UI.gameOver();
            return;
        }

        UI.resetForNewHand(this.playerCash, this.playerBetValue, this.handsPlayed);
        this.handsPlayed++;
        this.newHand();
        UI.disableActionButtons();

        window.setTimeout(() => {
            UI.enableBetting();
        }, Time.veryShort);
    }

    checkIfPlaying() {
        window.setTimeout(() => {
            if (!this.isPlaying) {
                UI.displayModalMessage(Text.placeBet);
                this.checkIfPlaying();
            }
        }, Time.untilPrompt);
    }

    ////////// New Hand Methods \\\\\\\\\\
    newHand() {
        if (this.gameDeck.getCardCount() < 20) {
            UI.displayModalMessage(Text.shuffle);
            this.gameDeck = new Deck(52);
        }

        window.setTimeout(() => {
            this.dealInitialCards();
        }, Time.veryShort);

        this.checkIfPlaying();
    }

    dealInitialCards() {
        for (let i = 0; i < 2; i++) {
            let playerCardContainer = UI.getPlayerFrontCardContainer(i);
            let dealerCardContainer = UI.getDealerFrontCardContainer(i);

            let playerCard = this.gameDeck.dealCard();
            let dealerCard = this.gameDeck.dealCard();

            this.playerHand.addCard(playerCard);
            this.dealerHand.addCard(dealerCard);

            UI.printCard(playerCardContainer, playerCard.getFileName());
            UI.printCard(dealerCardContainer, dealerCard.getFileName());
        }
    }

    increaseBet() {
        if (UI.isBettingDisabled) {
            return;
        }

        this.isPlaying = true;

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

        this.isPlaying = true;

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

        let card = this.gameDeck.dealCard();

        this.playerHand.addCard(card);

        let score = this.playerHand.getScore();

        UI.addPlayerCard(cardIndex, card, score);

        //if score over 21, hand over
        if (score > 21) {
            return this.playerBust();
        }
    }

    standClick() {
        UI.disableActionButtons();
        this.dealerPlay();
    }

    surrenderClick() {
        this.playerSurrender();
    }

    betClick() {
        this.isPlaying = true;

        UI.disableBetting();

        // Fixes a bug by delaying the enabling of these actions
        window.setTimeout(() => {
            UI.enableActionButtons();
        }, UI.cardFlipDelay);

        UI.flipInitialCards();

        UI.printPlayerScore(this.playerHand.getScore());
        UI.printDealerScore(this.dealerHand.getPartialDealerScore());

        //get the players bet and subtract it from the players cash
        this.playerCurrentBet = document.getElementById("playerBetSelection").innerHTML.substring(1);
        this.playerCash -= Number(this.playerCurrentBet);
        this.updateMoney();

        this.checkBlackjack();
    }

    ////////// Score Methods \\\\\\\\\\
    checkBlackjack() {
        if (this.playerHand.getScore() !== 21) {
            return;
        }

        if (this.playerHand.getCardCount() !== 2) {
            return;
        }

        this.dealerFlipInitialCard();

        if (this.dealerHand.getScore() === 21) {
            this.playerPush();
        } else {
            this.playerBlackjack();
        }
    }

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
        let lostAmount = this.playerCurrentBet;
        UI.displayModalMessage(Text.playerBust + lostAmount);
        UI.disableActionButtons();
        window.setTimeout(() => {
            this.endHand();
        }, Time.medium);
    }

    dealerBust() {
        let winAmount = Number(this.playerCurrentBet) * 2;
        this.playerCash += winAmount;
        UI.displayModalMessage(Text.dealerBust + winAmount);
        UI.disableActionButtons();
        this.endHand();
    }

    playerPush() {
        let returnAmount = this.playerCurrentBet;
        this.playerCash += returnAmount;
        UI.displayModalMessage(Text.push + returnAmount);
        UI.disableActionButtons();
        window.setTimeout(() => {
            this.endHand();
        }, Time.medium);
    }

    playerSurrender() {
        let returnAmount = Number(this.playerCurrentBet) / 2;
        this.playerCash += returnAmount;
        UI.displayModalMessage(Text.playerSurrender + returnAmount);
        UI.disableActionButtons();
        this.endHand();
    }

    playerWin() {
        let winAmount = Number(this.playerCurrentBet) * 2;
        this.playerCash += winAmount;
        UI.displayModalMessage(Text.playerWinMoney + winAmount);
        UI.disableActionButtons();
        this.endHand();
    }

    dealerWin() {
        UI.displayModalMessage(Text.playerLoseMoney + this.playerCurrentBet);
        UI.disableActionButtons();
        this.endHand();
    }

    playerBlackjack() {
        let winAmount = Number(this.playerCurrentBet) + ((Number(this.playerCurrentBet) / 2) * 3);
        this.playerCash += winAmount;
        UI.displayModalMessage(Text.playerBlackjack + winAmount, Time.veryLong);
        UI.disableActionButtons();
        window.setTimeout(() => {
            this.endHand();
        }, Time.long);
    }

    dealerBlackjack() {
        UI.displayModalMessage(Text.dealerBlackjack + this.playerCurrentBet, Time.veryLong);
        UI.disableActionButtons();
        window.setTimeout(() => {
            this.endHand();
        }, Time.long);
    }

    endHand() {
        // Hands should be reset before UI.removeAllCards
        this.dealerHand = new Hand();
        this.playerHand = new Hand();

        this.playerCurrentBet = 0;
        this.dealerScorePrintQueue = [];
        this.updateMoney();
        UI.removeAllCards();
        this.mainGameLoop();
    }

    isGameOver() {
        if (this.playerCash <= 0) {
            UI.displayModalMessage(Text.gameOver, Time.eternal);
            // window.setTimeout(() => {
            //     let bodySelector = document.getElementsByTagName("body");
            //     let body = bodySelector[0];
            //     let allElements = document.getElementsByTagName("*");
            //     for (let i = 0; i < allElements.length; i++) {
            //         allElements[i].classList.add("hidden");
            //     }
            //     body.classList.remove("hidden");
            //     body.classList.add("gameOver");
            // }, 2000);
            return true;
        }
        return false;
    }

    ////////// Update Screen Methods \\\\\\\\\\
    updateMoney() {
        document.getElementById("playerBet").innerHTML = "Current Bet: $" + this.playerCurrentBet;
        document.getElementById("playerCash").innerHTML = "Total Cash: $" + this.playerCash;
    }

    ////////// Dealer Methods \\\\\\\\\\
    dealerFlipInitialCard() {
        let startingCardContainer = UI.getDealerFrontCardContainer(0);
        let startingCard = this.dealerHand.getCard(0);
        UI.printCard(startingCardContainer, startingCard.getFileName());
        UI.printDealerScore(this.dealerHand.getScore());
        UI.flipCard(startingCardContainer);
    }

    dealerPlay() {
        let printDelay = Time.veryShort;

        this.dealerFlipInitialCard();

        if (this.dealerHand.getScore() === 21) {
            this.dealerBlackjack();
            return;
        }

        while (this.dealerHand.getScore() <= 17) {
            //get the new card position
            let cardIndex = this.dealerHand.getCardCount();

            //deal a card
            let card = this.gameDeck.dealCard();

            this.dealerHand.addCard(card);

            let score = this.dealerHand.getScore();

            //delay printing card/score to the screen
            setTimeout(() => {
                UI.addDealerCard(cardIndex, card, score);
            }, printDelay, cardIndex, card, score);

            //add 1000 ms between each image/score print
            printDelay += Time.short;
        }

        if (printDelay < Time.long) {
            printDelay += Time.short;
        }

        setTimeout(() => { this.compareScores(); }, printDelay);
    }
}

let game;
window.addEventListener('load', () => {
    window.setTimeout(() => {
        document.getElementById('game-start-background').classList.add('transparent');
    }, Time.instant);
    game = new Game();
});
// window.addEventListener('resize', () => {
//     UI.setOnDeckStyle();
//     UI.setUpCardContainers();
// });