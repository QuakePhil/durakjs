
game.shuffleUp(3);
game.updateUI();

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