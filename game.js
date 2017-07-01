let game = {
    players: [],
    table: [],
    place: 1, // which place are we playing for
    currentPlayer: 0, // player currently attacking

    wildSuit: 0,

    defender: function() {
        let defendingPlayer = game.currentPlayer + 1;
        if (defendingPlayer >= game.players.length) return 0;
        return defendingPlayer;
    },

    clearDOM: function(which) {
        while (which.firstChild) { which.removeChild(which.firstChild); }
    },

    shuffleUp: function(numOfPlayers) {
        game.place = 1; // playing for 1st place initially
        game.currentPlayer = 0; // should determine this by who has lowest wildcard, or who last lost?

        // shuffle the deck
        deck.brandNew();
        deck.shuffle();

        // deal the players
        game.players = [];
        for (let i = 0; i < numOfPlayers; ++i) {
            let newPlayer = new player('Player #'+(i+1));
            for (let j = 0; j < 6; ++j) {
                let playerCard = deck.cards.pop();
                playerCard.player = i;
                playerCard.index = j;
                newPlayer.cards.push(playerCard);
            }
            game.players.push(newPlayer);
        }
        game.wildSuit = deck.cards[0].suit;
    },

    validCard(thisCard) {
        let cardToBeat = this.table[this.table.length-1];
        if (thisCard.suit == cardToBeat.suit && thisCard.face > cardToBeat.face) {
            return true;
        }
        if (thisCard.suit == game.wildSuit && cardToBeat.suit !== game.wildSuit) {
            return true;
        }
        return false;
    },

    playState: function() {
        return (game.table.length %2 == 0) ? 'attacking' : 'defending';
    },

    // only attacker can click bita
    // if there's a defended table, put it to discards
    endTurn: function() {
        if (game.playState() !== 'attacking') {
            return alert('Only attacker can end turn');
        }
    },

    // given card object, move it to table.  if its already on table, move it to discards
    play: function(thisCard) {
        if (typeof game.players[thisCard.player] !== 'undefined') {
            if (game.playState() == 'defending') {
                if (thisCard.player !== game.defender()) {
                    return alert('Player #'+(game.defender()+1)+'\'s turn to defend');
                }

                if (!game.validCard(thisCard)) {
                    return alert('That card doesnt work');
                }
            } else if (thisCard.player !== game.currentPlayer) {
                // also need to check if subsequent attacks are valid
                return alert('Player #'+(game.currentPlayer+1)+'\'s turn to attack');
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

        game.players.forEach(function(thisPlayer) {
            thisPlayer.sortByWildcard(game.wildSuit);
            playersDOM.appendChild(thisPlayer.getElement());
        });

        tableDOM.appendChild(document.createTextNode('Table'));
        tableDOM.appendChild(document.createElement('br'));

        for (let i = 0; i < game.table.length; ++i) {
            tableDOM.appendChild(card.getElement(game.table[i], i % 2 !== 0));
        };

        let currentPlayerName = game.playState() == 'attacking' 
            ? game.players[game.currentPlayer].name
            : game.players[game.defender()].name;
        deckDOM.appendChild(document.createTextNode(currentPlayerName + ':'));

        deckDOM.appendChild(card.getEndTurnElement());
        deckDOM.appendChild(card.getDeckElement(deck.cards[0], deck.cards));
        deckDOM.appendChild(card.getDeckElement(deck.discards[0], deck.discards));
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

// todo - non-pointer-clickable deck/deck-cardback