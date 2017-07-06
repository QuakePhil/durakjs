function player (index) {
    this.index = index;
    this.cards = [];
    this.name = 'Player #'+(index+1);
    this.place = 0;

    this.sortByWildcard = function(wildSuit) {
        this.cards.sort(function(a, b) {
            if (a.suit == b.suit) return a.face > b.face;
            if (a.suit == wildSuit) return -1;
            if (b.suit == wildSuit) return 1;
            return a.suit > b.suit;
        });
        // don't forget to re-index for the UI
        for (var i in this.cards) {
            this.cards[i].index = parseInt(i);
        }
    };

    this.takeCards = function(cards, howMany = 1) {
        if (this.place == 0)
        for (let i = 0; i < howMany; ++i) {
            if (cards.length == 0) return;
            this.cards.push(cards.pop());
            this.cards[this.cards.length-1].player = this.index;
        }
    };
}