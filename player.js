function player (index) {
    this.index = index;
    this.cards = [];
    this.name = 'Player #'+(index+1);
    this.place = 0;

    this.getElement = function() {
        let newElement = document.createElement('div');

        newElement.appendChild(document.createTextNode(this.name));
        newElement.appendChild(document.createElement('br'));

        for (let i = 0; i < this.cards.length; ++i) {
            newElement.appendChild(card.getClickableElement(this.cards[i]));
        }

        newElement.appendChild(document.createElement('br'));
        newElement.appendChild(document.createElement('br'));
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
    };

    this.takeCards = function(cards, howMany = 1) {
        for (let i = 0; i < howMany; ++i) {
            this.cards.push(cards.pop());
            this.cards[this.cards.length-1].player = this.index;
        }
    };
}