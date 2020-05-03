import Card from './Card.js';

export default class Deck {
    constructor() {
        this.isDeckStacked = false;

        ////////// Class Variables \\\\\\\\\\
        this.deck = this.createDeck();

        ////////// Method Bindings \\\\\\\\\\
        this.createDeck = this.createDeck.bind(this);
        this.shuffleDeck = this.shuffleDeck.bind(this);
        this.dealCard = this.dealCard.bind(this);
        this.stackDeck = this.stackDeck.bind(this);

        // Stacked deck for testing blackjacks
        if (this.isDeckStacked) {
            this.stackDeck();
        } else {
            this.shuffleDeck();
        }
    }

    getCardCount() {
        return this.deck.length;
    }

    createDeck() {
        let deck = [];
        for (let suit = 0; suit <= 3; suit++) {
            for (let value = 1; value <= 13; value++) {
                let card = new Card(suit, value);
                deck.push(card);
            }
        }
        return deck;
    }

    shuffleDeck() {
        for (let j = 0; j < this.deck.length - 1; j++) {
            for (let i = 0; i < this.deck.length - 1; i++) {
                let randomIndex = Math.floor(Math.random() * 52);
                let tempCard = this.deck[randomIndex];
                this.deck[randomIndex] = this.deck[i];
                this.deck[i] = tempCard;
            }
        }
    }

    dealCard() {
        if (this.deck.length > 0)
            return this.deck.pop();
        else
            console.log("Deal Card Error.");
    }

    // Stacked deck for testing blackjacks
    stackDeck() {

        // // Test Push with blackjacks
        // for (let i = 0; i < 2; i++) {
        //     let card = new Card(0, 1);
        //     this.deck.push(card);
        // }
        // for (let i = 0; i < 2; i++) {
        //     let card = new Card(0, 10);
        //     this.deck.push(card);
        // }


        // Test Player blackjack
        for (let i = 0; i < 1; i++) {
            let card = new Card(0, 1);
            this.deck.push(card);
        }
        for (let i = 0; i < 2; i++) {
            let card = new Card(0, 10);
            this.deck.push(card);
        }


    }
}