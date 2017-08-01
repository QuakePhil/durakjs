let deck = {
    cards: [],    // cards in play
    discards: [], // cards out of play ("bita")

    brandNew: function() {
        let suit, face;

        this.cards = [];
        for (suit = 0; suit < 4; ++suit) {
            for (face = /*6*/10; face <= 14; ++face) {
                this.cards.push({suit: suit, face: face});
            }
        }
    },

    // re: https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
    shuffle: function() {
console.log('Warning: shuffling disabled for debugging');
return;
        for (let i = this.cards.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            // ES6 alert
            [this.cards[i-1], this.cards[j]] = [this.cards[j], this.cards[i-1]];
        }
    },
};
