function player (name) {
    this.cards = [];
    this.name = name;

    this.getElement = function() {
        let newElement = document.createElement('div');

        newElement.appendChild(document.createTextNode(this.name));
        newElement.appendChild(document.createElement('br'));

        for (let i = 0; i < this.cards.length; ++i) {
            newElement.appendChild(card.getElement(this.cards[i]));
        }

        return newElement;
    };

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
    }
}