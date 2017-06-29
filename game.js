let game = {
    players: [],
    table: [],

    wildSuit: 0,

    clearDOM: function(which) {
        while (which.firstChild) { which.removeChild(which.firstChild); }
    },

    shuffleUp: function(numOfPlayers) {
        // shuffle the deck
        deck.brandNew();
        deck.shuffle();

        // deal the players
        this.players = [];
        for (let i = 0; i < numOfPlayers; ++i) {
            let newPlayer = new player('Player #'+(i+1));
            for (let j = 0; j < 6; ++j) {
                let playerCard = deck.cards.pop();
                playerCard.player = i;
                playerCard.index = j;
                newPlayer.cards.push(playerCard);
            }
            this.players.push(newPlayer);
        }
        this.wildSuit = deck.cards[0].suit;
    },

    // given card object, move it to table.  if its already on table, move it to discards
    play: function(card) {
        if (typeof this.players[card.player] !== 'undefined') {
            if (typeof this.players[card.player].cards[card.index] !== 'undefined') {
                // this third check is a bit more paranoid than the first two, maybe
                if (this.players[card.player].cards[card.index].suit == card.suit
                    && this.players[card.player].cards[card.index].face == card.face) {
                    this.table.push(card);
                    this.players[card.player].cards.splice(card.index, 1);
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

        this.clearDOM(playersDOM);
        this.clearDOM(tableDOM);
        this.clearDOM(deckDOM);

        this.players.forEach(function(thisPlayer) {
            thisPlayer.sortByWildcard(game.wildSuit);
            playersDOM.appendChild(thisPlayer.getElement());
        });

    }
};
