export default class Hand {

    constructor() {
        this.cards = [];
        this.currentScore = 0;
    }

    addCard(card) {
        this.cards.push(card);
    }

    getCard(index) {
        return this.cards[index];
    }

    getPartialDealerScore() {
        let shownCard = this.cards[1];
        let partialScore = shownCard.getValue();

        if (shownCard.getName() === "A") {
            partialScore += 10;
        }

        return partialScore;
    }

    getScore() {
        this.sumScore();
        return this.currentScore;
    }

    getCardCount() {
        return this.cards.length;
    }

    sumScore() {
        let sum = 0;
        let hasAce = false;

        this.cards.forEach(card => {
            sum += card.getValue();

            if (!hasAce && card.getName() === "A") {
                hasAce = true;
            }
        });

        // Add the extra 10 points for Ace if necessary
        if (hasAce && (sum + 10) <= 21) {
            sum += 10;
        }

        this.currentScore = sum;
    }


}