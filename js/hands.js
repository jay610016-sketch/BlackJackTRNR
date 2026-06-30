/*
====================================================
hands.js
BlackjackTRNR Hand Generator
====================================================

This file is responsible for generating ONLY valid
practice hands.

Strategy.js decides the correct move.
Script.js displays the cards.

This file NEVER decides strategy.
====================================================
*/

const SUITS = ["♠", "♥", "♦", "♣"];

const DEALER_UPCARDS = [
    "2","3","4","5","6","7","8","9","10","A"
];

const HARD_TOTALS = [
    5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21
];

const SOFT_TOTALS = [
    13,14,15,16,17,18,19,20
];

const PAIR_RANKS = [
    "A",2,3,4,5,6,7,8,9,10
];

const TEN_VALUE_CARDS = [
    "10","J","Q","K"
];

function randomItem(array){

    return array[
        Math.floor(Math.random()*array.length)
    ];

}

function randomSuit(){

    return randomItem(SUITS);

}

function randomTen(){

    return randomItem(TEN_VALUE_CARDS);

}

function makeCard(rank){

    return {

        rank: rank.toString(),

        suit: randomSuit()

    };

}

/*
----------------------------------------------------
CARD VALUES
----------------------------------------------------
*/

function valueOf(rank){

    switch(rank){

        case "A":
            return 11;

        case "J":
        case "Q":
        case "K":
        case "10":
            return 10;

        default:
            return Number(rank);

    }

}
/*
----------------------------------------------------
HARD HAND GENERATOR
----------------------------------------------------
*/

const NON_ACE_RANKS = [
    "2","3","4","5","6","7","8","9",
    "10","J","Q","K"
];

function generateHardCards(total){

    const possibilities = [];

    const ranks = [
        "2","3","4","5","6","7","8","9",
        "10","J","Q","K"
    ];

    for(let i = 0; i < ranks.length; i++){

        for(let j = i; j < ranks.length; j++){

            const first = ranks[i];
            const second = ranks[j];

            const value1 = valueOf(first);
            const value2 = valueOf(second);

            if(value1 + value2 !== total){
                continue;
            }

            // Reject actual pairs

            if(first === second){
                continue;
            }

            possibilities.push([
                first,
                second
            ]);

        }

    }

    if(possibilities.length === 0){

        throw new Error(
            "Unable to generate hard total " + total
        );

    }

    const chosen = randomItem(possibilities);

    return [

        makeCard(chosen[0]),

        makeCard(chosen[1])

    ];

}
/*
----------------------------------------------------
SOFT HAND GENERATOR
----------------------------------------------------
*/

function generateSoftCards(total){

    const secondValue = total - 11;

    let secondRank;

    if(secondValue === 10){

        secondRank = randomTen();

    }else{

        secondRank = secondValue.toString();

    }

    return [

        makeCard("A"),

        makeCard(secondRank)

    ];

}

/*
----------------------------------------------------
PAIR GENERATOR
----------------------------------------------------
*/

function generatePairCards(rank){

    /*
        Pair of 10-value cards.

        Choose ONE ten-value rank and use it twice,
        so it is a true pair.
    */

    if(rank === 10){

        const tenRank = randomTen();

        return [

            makeCard(tenRank),

            makeCard(tenRank)

        ];

    }

    return [

        makeCard(rank.toString()),

        makeCard(rank.toString())

    ];

}

/*
----------------------------------------------------
SCENARIO GENERATOR
----------------------------------------------------
*/

function randomScenarioType(){

    return randomItem([
        "hard",
        "soft",
        "pair"
    ]);

}

function randomDealerCard(){

    return {

        rank: randomItem(DEALER_UPCARDS),

        suit: randomSuit()

    };

}
/*
----------------------------------------------------
MAIN SCENARIO GENERATOR
----------------------------------------------------
*/

function generateScenario(){

    const type = randomScenarioType();

    let player;
    let cards;

    switch(type){

        case "hard":{

            const total = randomItem(HARD_TOTALS);

            player = {
                type: "hard",
                value: total
            };

            cards = generateHardCards(total);

            break;
        }

        case "soft":{

            const total = randomItem(SOFT_TOTALS);

            player = {
                type: "soft",
                value: total
            };

            cards = generateSoftCards(total);

            break;
        }

        case "pair":{

            const rank = randomItem(PAIR_RANKS);

            player = {
                type: "pair",
                value: rank
            };

            cards = generatePairCards(rank);

            break;
        }

    }

    const hand = {

        dealer: randomDealerCard(),

        player: player,

        cards: cards

    };

    validateScenario(hand);

    return hand;

}

/*
----------------------------------------------------
VALIDATION
----------------------------------------------------

These checks run while we're developing.
They'll help us catch bugs early.
*/

function validateScenario(hand){

    if(hand.player.type === "soft"){

        if(hand.cards[0].rank !== "A"){

            console.error(hand);

            throw new Error(
                "Soft hand does not start with an Ace."
            );

        }

    }

    if(hand.player.type === "pair"){

        if(hand.cards[0].rank !== hand.cards[1].rank){

            console.error(hand);

            throw new Error(
                "Pair hand is not actually a pair."
            );

        }

    }

}