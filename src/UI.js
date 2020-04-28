export default class UI {

    static actionButtons = ["hit", "stand", "surrender"];

    static isBettingDisabled = false;

    static setUpHand(playerCash, playerBet) {
        document.getElementById("playerScore").innerText = 0;
        document.getElementById("dealerScore").innerText = 0;
        document.getElementById("playerCash").innerHTML = "Total Cash: $" + playerCash;

        let annimationDelay = 0;

        for (let i = 0; i < 2; i++) {
            window.setTimeout(() => {
                UI.placeCard(document.getElementById("player" + i + "-back"));
            }, annimationDelay);

            annimationDelay += 250;

            window.setTimeout(() => {
                UI.placeCard(document.getElementById("dealer" + i + "-back"));
            }, annimationDelay);

            annimationDelay += 250;
        }

        document.getElementById("playerBetSelection").innerHTML = "$" + playerBet;
    }

    static setUpCardLocations() {
        // Calculate initial DOM locations of each card
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

        // Each card must be set as fixed and marginLeft 0 AFTER the initial locations are calculated
        for (let i = 5; i > -1; i--) {
            let dealerCardElement = document.getElementById("dealer" + i);
            let playerCardElement = document.getElementById("player" + i);

            playerCardElement.style.position = "fixed";
            dealerCardElement.style.position = "fixed";
            playerCardElement.style.marginLeft = "0";
            dealerCardElement.style.marginLeft = "0";
        }
    }

    static getPlayerBackCardLocation(index) {
        return document.getElementById("player" + index + "-back");
    }

    static getDealerBackCardLocation(index) {
        return document.getElementById("dealer" + index + "-back");
    }

    static getPlayerFrontCardLocation(index) {
        return document.getElementById("player" + index + "-front");
    }

    static getDealerFrontCardLocation(index) {
        return document.getElementById("dealer" + index + "-front");
    }

    static setOnDeckStyle() {
        let deck = document.getElementById("deck");
        let deckPosition = deck.getBoundingClientRect();
        let deckLocationStyle = document.createElement('style');
        deckLocationStyle.type = "text/css";
        deckLocationStyle.innerHTML = `.onDeck { top: ${deckPosition.top}px !important; left: ${deckPosition.left}px !important; }`
        document.getElementsByTagName('head')[0].appendChild(deckLocationStyle);
    }

    ////////// Print Methods \\\\\\\\\\
    static printPlayerScore(score) {
        document.getElementById("playerScore").innerText = score;
    }

    static printDealerScore(score) {
        document.getElementById("dealerScore").innerText = score;
    }

    static placeCard(cardLocation) {
        cardLocation.parentElement.parentElement.classList.add("onDeck");

        window.setTimeout(() => {
            cardLocation.setAttribute("src", "./images/cards/blue_back.png");
            cardLocation.parentElement.parentElement.classList.remove("onDeck");
        }, 1500, cardLocation);
    }

    static flipInitialCards() {
        let annimationDelay = 0;

        for (let i = 1; i >= 0; i--) {
            let dealerCardElement = UI.getDealerFrontCardLocation(i);
            let playerCardElement = UI.getPlayerFrontCardLocation(i);
            window.setTimeout(() => {
                UI.flipCard(playerCardElement);
            }, annimationDelay);

            annimationDelay += 250;

            window.setTimeout(() => {
                // Don't flip the first dealer card yet
                if (i) {
                    UI.flipCard(dealerCardElement);
                }
            }, annimationDelay);

            annimationDelay += 250;
        }
    }

    static flipCard(cardLocation) {
        cardLocation.parentElement.classList.add("is-flipped");
    }

    static printCard(cardLocation, cardName) {
        //set the src attribute of the image element "cardLocation" to "cardName.png"
        cardLocation.setAttribute("src", "./images/cards/" + cardName + ".png");
    }

    ////////// Button Enable/Disable Methods \\\\\\\\\\
    static disableButton(buttonName) {
        document.getElementById(buttonName).setAttribute("disabled", "true");
    }
    static disableActions() {

        UI.actionButtons.forEach(button => {
            UI.disableButton(button);
        });
    }

    static enableButton(buttonName) {
        document.getElementById(buttonName).removeAttribute("disabled");
    }

    static enableActions() {
        UI.actionButtons.forEach(button => {
            UI.enableButton(button);
        });
    }

    static disableBetting() {
        UI.isBettingDisabled = true;
        document.getElementById("bet").setAttribute("disabled", "true");
    }

    static enableBetting() {
        UI.isBettingDisabled = false;
        document.getElementById("bet").removeAttribute("disabled");
    }

    static removeAllCards() {
        for (let i = 1; i <= 5; i++) {
            let playerCard = "player" + i + "-front";
            let dealerCard = "dealer" + i + "-front";
            document.getElementById(playerCard).removeAttribute("src");
            document.getElementById(dealerCard).removeAttribute("src");
        }
    }
}