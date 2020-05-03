import Animate from './Animate.js';
import Time from './Time.js';


export default class UI {


    static actionButtons = ["hit", "stand", "surrender"];

    static isBettingDisabled = false;

    static setUpCardContainers() {
        // Calculate initial DOM Containers of each card
        for (let i = 5; i >= 0; i--) {
            let dealerCardElement = document.getElementById("dealer" + i);
            let playerCardElement = document.getElementById("player" + i);
            let dealerPosition = dealerCardElement.getBoundingClientRect();
            let playerPosition = playerCardElement.getBoundingClientRect();

            dealerCardElement.style.top = dealerPosition.top + "px";
            dealerCardElement.style.left = dealerPosition.left + "px";

            playerCardElement.style.top = playerPosition.top + "px";
            playerCardElement.style.left = playerPosition.left + "px";
        }

        // Each card must be set as fixed and marginLeft 0 AFTER the initial Containers are calculated
        for (let i = 5; i > -1; i--) {
            let dealerCardElement = document.getElementById("dealer" + i);
            let playerCardElement = document.getElementById("player" + i);

            playerCardElement.style.position = "fixed";
            dealerCardElement.style.position = "fixed";
            playerCardElement.style.marginLeft = "0";
            dealerCardElement.style.marginLeft = "0";

            dealerCardElement.classList.add("onDeck");
            playerCardElement.classList.add("onDeck");
        }
    }

    static resetForNewHand(playerCash, playerBet) {
        document.getElementById("playerScore").innerText = 0;
        document.getElementById("dealerScore").innerText = 0;
        document.getElementById("playerCash").innerHTML = "Total Cash: $" + playerCash;

        let animationDelay = Time.veryShort;

        // Stagger inital card animations
        for (let i = 0; i < 2; i++) {
            window.setTimeout(() => {
                UI.placeCard(document.getElementById("player" + i + "-back"));
            }, animationDelay, i);

            animationDelay += Time.instant;

            window.setTimeout(() => {
                UI.placeCard(document.getElementById("dealer" + i + "-back"));
            }, animationDelay, i);

            animationDelay += Time.instant;
        }

        document.getElementById("playerBetSelection").innerHTML = "$" + playerBet;
    }

    static flipInitialCards() {
        let animationDelay = 0;

        for (let i = 1; i >= 0; i--) {
            let dealerCardElement = UI.getDealerFrontCardContainer(i);
            let playerCardElement = UI.getPlayerFrontCardContainer(i);
            window.setTimeout(() => {
                UI.flipCard(playerCardElement);
            }, animationDelay);

            animationDelay += Time.instant;

            window.setTimeout(() => {
                // Don't flip the first dealer card yet
                if (i) {
                    UI.flipCard(dealerCardElement);
                }
            }, animationDelay);

            animationDelay += Time.instant;
        }
    }



    static getPlayerCardContainer(index) {
        return document.getElementById("player" + index);
    }

    static getDealerCardContainer(index) {
        return document.getElementById("dealer" + index);
    }

    static getPlayerBackCardContainer(index) {
        return UI.getBackCardContainer(index, "player");
    }

    static getDealerBackCardContainer(index) {
        return UI.getBackCardContainer(index, "dealer");
    }

    static getBackCardContainer(index, user) {
        return document.getElementById(user + index + "-back");
    }

    static getPlayerFrontCardContainer(index) {
        return UI.getFrontCardContainer(index, "player");
    }

    static getDealerFrontCardContainer(index) {
        return UI.getFrontCardContainer(index, "dealer");
    }

    static getFrontCardContainer(index, user) {
        return document.getElementById(user + index + "-front");
    }

    static setOnDeckStyle() {
        let deck = document.getElementById("deck");
        let deckPosition = deck.getBoundingClientRect();
        let deckContainerStyle = document.createElement('style');
        deckContainerStyle.type = "text/css";
        deckContainerStyle.innerHTML = `.onDeck { top: ${deckPosition.top}px !important; left: ${deckPosition.left}px !important; position: fixed; }`;
        document.getElementsByTagName('head')[0].appendChild(deckContainerStyle);
    }

    ////////// Print Methods \\\\\\\\\\
    static printPlayerScore(score) {
        UI.printScore(score, "player");
    }

    static printDealerScore(score) {
        UI.printScore(score, "dealer");
    }

    static printScore(score, user) {
        document.getElementById(user + "Score").innerText = score;
    }

    static placeCard(cardContainer) {
        window.setTimeout(() => {
            cardContainer.setAttribute("src", "./images/cards/blue_back.png");
            cardContainer.parentElement.parentElement.classList.remove("onDeck");
        }, Time.instant, cardContainer);
    }

    static flipCard(cardContainer) {
        cardContainer.parentElement.classList.add("is-flipped");
    }

    static unflipCard(cardContainer) {
        cardContainer.parentElement.classList.remove("is-flipped");
    }

    static printCard(cardContainer, cardName) {
        //set the src attribute of the image element "cardContainer" to "cardName.png"
        cardContainer.setAttribute("src", "./images/cards/" + cardName + ".png");
    }

    static moveDealerCardToDeck(index) {
        UI.getDealerFrontCardContainer(index).parentElement.parentElement.classList.add('onDeck');
    }

    static movePlayerCardToDeck(index) {
        UI.getPlayerFrontCardContainer(index).parentElement.parentElement.classList.add('onDeck');
    }

    static moveDealerCardToPlayArea(index) {
        UI.getDealerFrontCardContainer(index).parentElement.parentElement.classList.remove('onDeck');
    }

    static movePlayerCardToPlayArea(index) {
        UI.getPlayerFrontCardContainer(index).parentElement.parentElement.classList.remove('onDeck');
    }

    ////////// Button Enable/Disable Methods \\\\\\\\\\
    static disableButton(buttonName) {
        document.getElementById(buttonName).setAttribute("disabled", "true");
    }
    static disableActionButtons() {
        UI.actionButtons.forEach(button => {
            UI.disableButton(button);
        });
    }

    static enableButton(buttonName) {
        document.getElementById(buttonName).removeAttribute("disabled");
    }

    static enableActionButtons() {
        UI.actionButtons.forEach(button => {
            UI.enableButton(button);
        });
    }

    static disableBetting() {
        UI.isBettingDisabled = true;
        document.getElementById('playerBetArea').classList.add('faded');
        document.getElementById("bet").setAttribute("disabled", "true");
    }

    static enableBetting() {
        UI.isBettingDisabled = false;
        document.getElementById('playerBetArea').classList.remove('faded');
        document.getElementById("bet").removeAttribute("disabled");
    }

    static addPlayerCard(index, card, score) {
        UI.addCard(index, card, score, "player");
    }

    static addDealerCard(index, card, score) {
        UI.addCard(index, card, score, "dealer");
    }

    static addCard(index, card, score, user) {
        let cardFrontContainer = UI.getFrontCardContainer(index, user);

        UI.placeCard(UI.getBackCardContainer(index, user));
        UI.printCard(cardFrontContainer, card.getFileName());
        window.setTimeout(() => {
            UI.flipCard(cardFrontContainer);
            UI.printScore(score, user);
        }, Time.instant, cardFrontContainer, score);
    }

    static removeAllCards() {
        for (let i = 0; i <= 5; i++) {
            let playerFrontCardContainer = UI.getPlayerFrontCardContainer(i);
            let dealerFrontCardContainer = UI.getDealerFrontCardContainer(i);
            UI.moveDealerCardToDeck(i);
            UI.movePlayerCardToDeck(i);
            UI.unflipCard(playerFrontCardContainer);
            UI.unflipCard(dealerFrontCardContainer);
            playerFrontCardContainer.removeAttribute("src");
            UI.getPlayerBackCardContainer(i).removeAttribute("src");
            dealerFrontCardContainer.removeAttribute("src");
            UI.getDealerBackCardContainer(i).removeAttribute("src");
        }
    }



    //---------- MODAL METHODS ------------\\
    static displayModalMessage(message, displayLength) {
        if (Animate.isModalShown) {
            UI.displayDelayedModalMessage(message)
        } else {
            document.getElementById('modal-message').innerText = message;
            Animate.modal(displayLength);
        }
    }

    static displayDelayedModalMessage(message, displayLength) {
        window.setTimeout(() => {
            UI.displayModalMessage(message, displayLength);
        }, displayLength, message);
    }
}