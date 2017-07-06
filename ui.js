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
            ui.updateUI();
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
            ui.updateUI();
        });
        return newElement;
    },

    playerPlaces: function() {
        return 'this function broken atm';
        let places = [];
        for (let i = 0; i < game.players.length; ++i) {
            places.push({place: game.players[i].place, name: game.players[i].name});
        }
        places.sort(function(a, b) {
            return a.place < b.place;
        });
        let out = '';
        for (let i = 0; i < places.length; ++i) {
            out = out + i + ': ' + places[i].name + '\n';
        }
        return out;
    },

    tableFaces: function() {
        let faces = [];
        game.table.forEach(function(tableCard) {
            faces.push(card.faces[tableCard.face]);
        });
        return faces.join();
    },

    clearDOM: function(which) {
        while (which.firstChild) { which.removeChild(which.firstChild); }
    },

    updateUI: function() {
        let playersDOM = document.getElementById('players');
        let tableDOM   = document.getElementById('table');
        let deckDOM    = document.getElementById('deck');

        ui.clearDOM(playersDOM);
        ui.clearDOM(tableDOM);
        ui.clearDOM(deckDOM);

        // put new game ui here

        if (game.players.length == 0) {
            return;
        }

        game.players.forEach(function(thisPlayer) {
            thisPlayer.sortByWildcard(game.wildSuit);
            playersDOM.appendChild(ui.getPlayerElement(thisPlayer));
        });

        tableDOM.appendChild(document.createTextNode('Table'));
        tableDOM.appendChild(document.createElement('br'));

        for (let i = 0; i < game.table.length; ++i) {
            tableDOM.appendChild(ui.getCardElement(game.table[i], i % 2 !== 0));
        };


        deckDOM.appendChild(document.createTextNode(game.currentPlayerName() + ':'));

        deckDOM.appendChild(ui.getEndTurnElement());
        if (deck.cards.length == 0) {
            deckDOM.appendChild(document.createTextNode(card.suits[game.wildSuit]));
        } else {
            deckDOM.appendChild(ui.getDeckElement(deck.cards[0], deck.cards));
            deckDOM.appendChild(document.createElement('br'));
        }
        deckDOM.appendChild(document.createElement('br'));
        deckDOM.appendChild(document.createElement('br'));
        deckDOM.appendChild(document.createElement('br'));
        deckDOM.appendChild(document.createElement('br'));
        deckDOM.appendChild(ui.getDeckElement(false, deck.discards));
    }

}