import Card from './Card.js';

export default class Deck {
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
        for (let suit = 0; suit <= 3; suit++) {
            for (let value = 1; value <= 13; value++) {
                let c = new Card(suit, value);
                newDeck.push(c);
            }
        }
        return newDeck;
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
}