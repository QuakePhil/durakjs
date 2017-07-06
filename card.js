let card = {
    suits: ['♠', '♥', '♦', '♣'],
    suitColors: ['black', 'red', 'red', 'black'],
    //suits: ['♤', '♡', '♢', '♧'],
    faces: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],

    text: function(instance) {
        return this.faces[instance.face] + this.suits[instance.suit];
    },

    dump: function(cards) {
        console.log(cards.length + ' cards:');
        for (let i = 0; i < cards.length; ++i) {
            console.log(this.text(cards[i]));
        }
    },

    validCard: function(thisCard) {
        if (game.table.length == 0) return true;

        if (game.attacking()) {
            for (let i = 0; i < game.table.length; ++i) {
                if (thisCard.face == game.table[i].face) return true;
            }
        } else {
            let cardToBeat = game.table[game.table.length-1];
            if (thisCard.suit == cardToBeat.suit && thisCard.face > cardToBeat.face) {
                return true;
            }
            if (thisCard.suit == game.wildSuit && cardToBeat.suit !== game.wildSuit) {
                return true;
            }
        }
        return false;
    },
};
