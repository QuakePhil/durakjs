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

    playState: function() {
        return (game.table.length %2 == 0) ? 'attacking' : 'defending';
    },

    // given card object, move it to table.  if its already on table, move it to discards
    play: function(card) {
        if (typeof game.players[card.player] !== 'undefined') {
            // if even number of cards on table, its time to attack
            if (game.playState() == 'attacking' && card.player !== game.currentPlayer) {
                return alert('Player #'+(game.currentPlayer+1)+'\'s turn to attack');
            }
            if (game.playState() == 'defending' && card.player !== game.defender()) {
                return alert('Player #'+(game.defender()+1)+'\'s turn to defend');
            }
            // if odd number of cards on the table, its time to defend
            if (typeof game.players[card.player].cards[card.index] !== 'undefined') {
                // this third check is a bit more paranoid than the first two, maybe
                if (game.players[card.player].cards[card.index].suit == card.suit
                    && game.players[card.player].cards[card.index].face == card.face) {
                    game.table.push(card);
                    game.players[card.player].cards.splice(card.index, 1);
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

        game.table.forEach(function(tableCard) {
            tableDOM.appendChild(card.getElement(tableCard));
        });

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
