let game = {
    players: [],
    table: [],
    place: 1, // which place are we playing for
    attacker: 0, // player currently attacking
    defender: 1, // player currently defending

    wildSuit: 0,

    nextAttacker: function() {
        let gameOver = true;
        for (let i = 0; i < game.players.length; ++i) {
            if (game.players[i].place == 0) {
                gameOver = false;
                break;
            }
        }
        if (gameOver) return false;

        do {
            game.attacker++;
            if (game.attacker >= game.players.length) game.attacker = 0;
        } while (game.players[game.attacker].place !== 0);

        game.defender = game.attacker;
        do {
            game.defender++;
            if (game.defender >= game.players.length) game.defender = 0;
        } while (game.players[game.defender].place !== 0);

        if (game.defender == game.attacker) {
            // todo: set place for defender here...
            return false;
        }
        return true;
    },

    currentPlayerName: function() {
        return game.attacking() 
            ? game.players[game.attacker].name
            : game.players[game.defender].name;
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

    validCard: function(thisCard) {
        if (this.table.length == 0) return true;

        if (game.attacking()) {
            for (let i = 0; i < game.table.length; ++i) {
                if (thisCard.face == game.table[i].face) return true;
            }
        } else {
            let cardToBeat = this.table[this.table.length-1];
            if (thisCard.suit == cardToBeat.suit && thisCard.face > cardToBeat.face) {
                return true;
            }
            if (thisCard.suit == game.wildSuit && cardToBeat.suit !== game.wildSuit) {
                return true;
            }
        }
        return false;
    },

    attacking: function() {
        return (game.table.length %2 == 0) ? true : false;
    },

    // only attacker can click bita
    // if there's a defended table, put it to discards
    endTurn: function() {
        // attack defended
        let wasAttacking = game.attacking();
        if (wasAttacking) {
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
        }
        game.table = [];

        // has the attacker won?
        if (game.players[game.attacker].cards.length == 0) {
            game.players[game.attacker].place = game.place;
            game.place++;
        }

        // deal up to 6 to anyone who needs, starting with the attacker
        for (let i = game.attacker; i < game.players.length; ++i) {
            game.players[i].takeCards(deck.cards, 6 - game.players[i].cards.length);
        }
        for (let i = 0; i < game.attacker; ++i) {
            game.players[i].takeCards(deck.cards, 6 - game.players[i].cards.length);
        }

        // next attacker
        let keepPlaying = game.nextAttacker();
        // if defender clicked end of turn, then skip his turn to attack
        if (!wasAttacking) {
            keepPlaying = game.nextAttacker();
        }

        if (!keepPlaying) {
            alert('Game over:\n' + ui.playerPlaces());
        }
    },

    // given card object, move it to table.  if its already on table, move it to discards
    play: function(thisCard) {
        if (typeof game.players[thisCard.player] !== 'undefined') {
            if (game.attacking()) {
                if (thisCard.player !== game.attacker) {
                    return alert('Player #'+(game.attacker+1)+'\'s turn to attack');
                }
            } else if (thisCard.player !== game.defender) {
                return alert('Player #'+(game.defender+1)+'\'s turn to defend');
            }

            if (!game.validCard(thisCard)) {
                if (game.attacking()) {
                    return alert('Must play same card faces as already on table (' + ui.tableFaces() + ')');
                } else {
                    return alert('That card doesnt work');
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

};
