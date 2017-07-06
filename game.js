let game = {
    players: [],
    table: [],
    place: 1, // which place are we playing for
    attacker: 0, // player currently attacking
    defender: 1, // player currently defending

    wildSuit: 0,

    nextAttacker: function() {
        game.attacker++;
        if (game.attacker >= game.players.length) game.attacker = 0;

        game.defender = game.attacker + 1;
        if (game.defender >= game.players.length) game.defender = 0;
    },

    currentPlayerName: function() {
        return game.playState() == 'attacking' 
            ? game.players[game.attacker].name
            : game.players[game.defender].name;
    },

    clearDOM: function(which) {
        while (which.firstChild) { which.removeChild(which.firstChild); }
    },

    shuffleUp: function(numOfPlayers) {
        game.place = 1; // playing for 1st place initially
        game.attacker = 0; // should determine this by who has lowest wildcard, or who last lost?

        // shuffle the deck
        deck.brandNew();
        deck.shuffle();

        // deal the players
        game.players = [];
        for (let i = 0; i < numOfPlayers; ++i) {
            let newPlayer = new player(i);
            newPlayer.takeCards(deck.cards, 6);
            game.players.push(newPlayer);
        }
        game.wildSuit = deck.cards[0].suit;
    },

    validCard(thisCard) {
        if (this.table.length == 0) return true;

        if (game.playState() == 'defending') {
            let cardToBeat = this.table[this.table.length-1];
            if (thisCard.suit == cardToBeat.suit && thisCard.face > cardToBeat.face) {
                return true;
            }
            if (thisCard.suit == game.wildSuit && cardToBeat.suit !== game.wildSuit) {
                return true;
            }
        } else {
            for (let i = 0; i < game.table.length; ++i) {
                if (thisCard.face == game.table[i].face) return true;
            }
        }
        return false;
    },

    playState: function() {
        return (game.table.length %2 == 0) ? 'attacking' : 'defending';
    },

    // only attacker can click bita
    // if there's a defended table, put it to discards
    endTurn: function() {
        // attack defended
        if (game.playState() == 'attacking') {
            if (game.table.length == 0) {
                return alert('Must attack at least once');
            }
            for (let i = 0; i < game.table.length; ++i) {
                deck.discards.push(game.table[i]);
            }
            // return alert('Only attacker can end turn');
        } else { // attack succeded
            for (let i = 0; i < game.table.length; ++i) {
                game.table[i].player = game.defender;
                game.players[game.defender].cards.push(game.table[i]);
            }
            // players who take the attacked cards forfeit their turn also
            game.nextAttacker();
        }
        game.table = [];

        // deal up to 6 to anyone who needs
        for (let i = 0; i < game.players.length; ++i) {
            game.players[i].takeCards(deck.cards, 6 - game.players[i].cards.length);
        }

        // next attacker
        game.nextAttacker();
    },

    tableFaces: function() {
        let faces = [];
        game.table.forEach(function(tableCard) {
            faces.push(card.faces[tableCard.face]);
        });
        return faces.join();
    },

    // given card object, move it to table.  if its already on table, move it to discards
    play: function(thisCard) {
        if (typeof game.players[thisCard.player] !== 'undefined') {
            if (game.playState() == 'defending') {
                if (thisCard.player !== game.defender) {
                    return alert('Player #'+(game.defender+1)+'\'s turn to defend');
                }

            } else if (thisCard.player !== game.attacker) {
                return alert('Player #'+(game.attacker+1)+'\'s turn to attack');
            }

            if (!game.validCard(thisCard)) {
                if (game.playState() == 'defending') {
                    return alert('That card doesnt work');
                } else {
                    return alert('Must play same card faces as already on table (' + game.tableFaces() + ')');
                }
            }

            // if odd number of cards on the table, its time to defend
            if (typeof game.players[thisCard.player].cards[thisCard.index] !== 'undefined') {
                // this third check is a bit more paranoid than the first two, maybe
                if (game.players[thisCard.player].cards[thisCard.index].suit == thisCard.suit
                    && game.players[thisCard.player].cards[thisCard.index].face == thisCard.face) {
                    game.table.push(thisCard);
                    game.players[thisCard.player].cards.splice(thisCard.index, 1);
                }
            }
        }
        // check if card is on table, then move to bita
        // otherwise, chek players
    },

    updateUI: function() {
        let playersDOM = document.getElementById('players');
        let tableDOM   = document.getElementById('table');
        let deckDOM    = document.getElementById('deck');

        game.clearDOM(playersDOM);
        game.clearDOM(tableDOM);
        game.clearDOM(deckDOM);

        // put new game ui here

        if (game.players.length == 0) {
            return;
        }

        game.players.forEach(function(thisPlayer) {
            thisPlayer.sortByWildcard(game.wildSuit);
            playersDOM.appendChild(thisPlayer.getElement());
        });

        tableDOM.appendChild(document.createTextNode('Table'));
        tableDOM.appendChild(document.createElement('br'));

        for (let i = 0; i < game.table.length; ++i) {
            tableDOM.appendChild(card.getElement(game.table[i], i % 2 !== 0));
        };


        deckDOM.appendChild(document.createTextNode(game.currentPlayerName() + ':'));

        deckDOM.appendChild(card.getEndTurnElement());
        deckDOM.appendChild(card.getDeckElement(deck.cards[0], deck.cards));
        deckDOM.appendChild(document.createElement('br'));
        deckDOM.appendChild(document.createElement('br'));
        deckDOM.appendChild(document.createElement('br'));
        deckDOM.appendChild(document.createElement('br'));
        deckDOM.appendChild(document.createElement('br'));
        deckDOM.appendChild(card.getDeckElement(false, deck.discards));
    }
};


// play a game of durak:
// game.place = 1 // players currently playing for 1st place
// player.place = 0 // 1,2,3 - means player has finished
// loop
//   one of the players (place = 0) makes a move
    // check if player won
//   after each move, check if deck is 0 and player cards is 0, then
//     player.place = game.place;
//     game.place++
//
    // check if end of game
//   check if no more players left with (place = 0)
//     exit loop
