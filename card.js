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

    getElement: function(card = false, isDefender = false) {
        let newElement = document.createElement('span');
        newElement.className = 'card';
        if (isDefender) {
            newElement.className = 'card defender';
        }

        if (card !== false) {
            newElement.appendChild(document.createTextNode(this.faces[card.face]));

            let suitElement = document.createElement('span');
            suitElement.style.color = this.suitColors[card.suit];
            suitElement.appendChild(document.createTextNode(this.suits[card.suit]));
            newElement.appendChild(suitElement);
        }

        return newElement;
    },

    getClickableElement: function(card) {
        let newElement = this.getElement(card);
        newElement.style.cursor = 'pointer';

        newElement.addEventListener('click', function() {
            game.play(card);
            game.updateUI();
        });

        return newElement;
    },

    getDeckElement: function(card, deck) {
        let deckElement = document.createElement('div');
        deckElement.style.position = 'relative';

        for (let i = 0; i < deck.length; ++i) {
            let newElement = (i == deck.length-1 ? this.getElement(card) : this.getElement());

            newElement.style.position = 'absolute';
            newElement.style.top = (i*2)+'px';
            newElement.style.left = (i*2)+'px';
            deckElement.appendChild(newElement)
        }

        return deckElement;
    },

    getEndTurnElement: function(card) {
        let newElement = document.createElement('input');
        newElement.value = game.playState() == 'attacking' ? 'Бита' : 'Возьму';
        newElement.type = 'button';
        newElement.className = 'bita';
        newElement.addEventListener('click', function() {
            game.endTurn();
        });
        return newElement;
    }
};
