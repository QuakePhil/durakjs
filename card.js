let card = {
    suits: ['♠', '♥', '♦', '♣'],
    suitColors: ['black', 'red', 'red', 'black'],
    //suits: ['♤', '♡', '♢', '♧'],
    faces: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],

    text: function(instance) {
        return this.faces[instance.face] + this.suits[instance.suit];
    },

    dump: function(cards) {
        console.log(cards.length + ' cards:');
        for (let i = 0; i < cards.length; ++i) {
            console.log(this.text(cards[i]));
        }
    },

    getElement: function(card) {
        let newElement = document.createElement('span');
        newElement.className = 'card';
        newElement.appendChild(document.createTextNode(this.faces[card.face]));

        let suitElement = document.createElement('span');
        suitElement.style.color = this.suitColors[card.suit];
        suitElement.appendChild(document.createTextNode(this.suits[card.suit]));
        newElement.appendChild(suitElement);

        return newElement;
    },
};