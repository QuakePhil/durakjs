let ui = {
    getPlayerElement: function(thisPlayer) {
        let newElement = document.createElement('div');

        newElement.appendChild(document.createTextNode(thisPlayer.name));
        newElement.appendChild(document.createElement('br'));

        for (let i = 0; i < thisPlayer.cards.length; ++i) {
            newElement.appendChild(ui.getClickableElement(thisPlayer.cards[i]));
        }

        newElement.appendChild(document.createElement('br'));
        newElement.appendChild(document.createElement('br'));
        return newElement;
    },

    getCardElement: function(thisCard = false, isDefender = false) {
        let newElement = document.createElement('span');
        newElement.className = 'card';
        if (isDefender) {
            newElement.className = 'card defender';
        }

        if (thisCard !== false) {
            newElement.appendChild(document.createTextNode(card.faces[thisCard.face]));

            let suitElement = document.createElement('span');
            suitElement.style.color = card.suitColors[thisCard.suit];
            suitElement.appendChild(document.createTextNode(card.suits[thisCard.suit]));
            newElement.appendChild(suitElement);
        }

        return newElement;
    },

    getClickableElement: function(thisCard) {
        let newElement = this.getCardElement(thisCard);
        newElement.style.cursor = 'pointer';

        newElement.addEventListener('click', function() {
            game.play(thisCard);
            game.updateUI();
        });

        return newElement;
    },

    getDeckElement: function(thisCard, deck) {
        let deckElement = document.createElement('div');
        deckElement.style.position = 'relative';

        for (let i = 0; i < deck.length; ++i) {
            let newElement = (i == deck.length-1 ? this.getCardElement(thisCard) : this.getCardElement());

            newElement.style.position = 'absolute';
            newElement.style.top = (i*2)+'px';
            newElement.style.left = (i*2)+'px';
            deckElement.appendChild(newElement)
        }

        return deckElement;
    },

    getEndTurnElement: function() {
        let newElement = document.createElement('input');
        newElement.value = game.attacking() ? 'Бита' : 'Возьму';
        newElement.type = 'button';
        newElement.className = 'bita';
        newElement.addEventListener('click', function() {
            game.endTurn();
            game.updateUI();
        });
        return newElement;
    },
}