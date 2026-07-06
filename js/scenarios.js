/*
==========================================
Master Scenario List
==========================================
*/

const SCENARIOS = [];

/*
==========================================
Dealer Cards
==========================================
*/

const dealerCards = [

    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    "A"

];

/*
==========================================
Hard Hands
==========================================
*/

for(let player = 8; player <= 17; player++){

    dealerCards.forEach(function(dealer){

        SCENARIOS.push({

            id:`hard-${player}-${dealer}`,

            type:"hard",

            player:player,

            dealer:dealer

        });

    });

}

/*
==========================================
Soft Hands
==========================================
*/

for(let player = 13; player <= 20; player++){

    dealerCards.forEach(function(dealer){

        SCENARIOS.push({

            id:`soft-${player}-${dealer}`,

            type:"soft",

            player:player,

            dealer:dealer

        });

    });

}

/*
==========================================
Pairs
==========================================
*/

const pairs = [

    "A",
    10,
    9,
    8,
    7,
    6,
    5,
    4,
    3,
    2

];

pairs.forEach(function(pair){

    dealerCards.forEach(function(dealer){

        SCENARIOS.push({

            id:`pair-${pair}-${dealer}`,

            type:"pair",

            player:pair,

            dealer:dealer

        });

    });

});

/*
==========================================
Developer Check
==========================================
*/

console.log(

    "Master Scenarios:",

    SCENARIOS.length

);