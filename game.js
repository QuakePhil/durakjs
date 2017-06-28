let game = {
    players: [],
    wildSuit: 0,

    shuffleUp: function(numOfPlayers) {
        // shuffle the deck
        deck.brandNew();
        deck.shuffle();

        // deal the players
        this.players = [];
        for (let i = 0; i < numOfPlayers; ++i) {
            let newPlayer = new player('Player #'+(i+1));
            for (let j = 0; j < 6; ++j) {
                newPlayer.cards.push(deck.cards.pop());
            }
            this.players.push(newPlayer);
        }
        this.wildSuit = deck.cards[0].suit;
    },

    updateUI: function() {
        let playersDOM = document.getElementById('players');
        while (playersDOM.firstChild) { playersDOM.removeChild(playersDOM.firstChild); }

        this.players.forEach(function(thisPlayer) {
            thisPlayer.sortByWildcard(game.wildSuit);
            playersDOM.appendChild(thisPlayer.getElement());
        });

    }
};
