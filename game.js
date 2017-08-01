let game = {
    moves: [],
    players: [],
    table: [],
    place: 1, // which place are we playing for
    attacker: 0, // player currently attacking
    defender: 1, // player currently defending

    wildSuit: 0,

    moveString: function() {
        let s = '' + game.players.length;
        // todo: s should also include the initial order of deck (or a randomizer seed?)
        /*
        var seed = 1;
        function random() {
            var x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        }

        */
        for (let i = 0; i < game.moves.length; ++i) {
            if (typeof game.moves[i].suit !== 'undefined') {
                s += ',' + game.moves[i].player + ':' + card.faces[game.moves[i].face] + card.suits[game.moves[i].suit];
            } else {// end of turn
                s += ',' + game.moves[i];
            }
        }
        return s;
    },

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

    shuffleUpAndDeal: function(history) {
        history = history.split(',');
        numOfPlayers = history[0];
        // todo: replay the rest of history[1...]

        game.moves = []; // game move history
        game.place = 1; // playing for 1st place initially
        game.attacker = 0; // should determine this by who has lowest wildcard, or who last lost?

        // shuffle the deck
        deck.brandNew();
        deck.shuffle();

        // deal the players
        game.players = [];
        for (let i = 0; i < numOfPlayers; ++i) {
            let newPlayer = new player(i);
            game.players.push(newPlayer);
        }
        // deal second cards second (helps testing)
        for (let i = 0; i < 6; ++i)
        for (let i = 0; i < numOfPlayers; ++i) {
            game.players[i].takeCards(deck.cards);
        }
        // this == 0 ? 0 bit is just for testing purposes when dealing a minideck
        game.wildSuit = deck.cards.length == 0 ? 0 : deck.cards[0].suit;
        ui.updateUI();

        // todo: replay the rest of history[1...]

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
            game.moves.push(game.attacker);
            if (game.table.length == 0) {
                return alert('Must attack at least once');
            }
            for (let i = 0; i < game.table.length; ++i) {
                deck.discards.push(game.table[i]);
            }
            // return alert('Only attacker can end turn');
        } else { // attack succeded
            game.moves.push(game.defender);
            for (let i = 0; i < game.table.length; ++i) {
                game.table[i].player = game.defender;
                game.players[game.defender].cards.push(game.table[i]);
            }
        }
        game.table = [];

        // has the attacker won?
        if (game.players[game.attacker].cards.length == 0) {
            // how to record ties?
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

            if (!card.validCard(thisCard)) {
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
                    game.moves.push(thisCard);
                    game.table.push(thisCard);
                    game.players[thisCard.player].cards.splice(thisCard.index, 1);
                }
            }
        }
        // check if card is on table, then move to bita
        // otherwise, chek players
    },

};
