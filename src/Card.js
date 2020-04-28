export default class Card {
    constructor(suit, value) {

        ////////// Class Variables \\\\\\\\\\
        this.suits = ["Hearts", "Clubs", "Spades", "Diamonds"];
        this.values = ["?", "A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"];

        this.suit = this.suits[suit];
        this.nameValue = this.values[value];
        this.numberValue = value;

        ////////// Method Bindings \\\\\\\\\\
        this.getValue = this.getValue.bind(this);
        this.getFileName = this.getFileName.bind(this);
        this.hasMatchingValue = this.hasMatchingValue.bind(this);
    }

    getName() {
        return this.nameValue;
    }

    getValue() {
        return this.numberValue >= 10 ? 10 : this.numberValue;
    }

    getFileName() {
        let suitLetter = this.suit.charAt(0);
        return this.nameValue + suitLetter;
    }

    hasMatchingValue(cardValue) {
        return this.nameValue === cardValue;
    }
}