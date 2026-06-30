/*
    strategy.js

    Blackjack Basic Strategy
    Rule Set:
    - Dealer Stands on Soft 17 (S17)
    - Double After Split (DAS)
    - Late Surrender
    - Blackjack Pays 3:2
*/

const HIT = "Hit";
const STAND = "Stand";
const DOUBLE = "Double";
const SPLIT = "Split";
const SURRENDER = "Surrender";

/*
==================================================
HARD TOTALS
==================================================
*/

const HARD = {

    5: {"2":HIT,"3":HIT,"4":HIT,"5":HIT,"6":HIT,"7":HIT,"8":HIT,"9":HIT,"10":HIT,"A":HIT},
    6: {"2":HIT,"3":HIT,"4":HIT,"5":HIT,"6":HIT,"7":HIT,"8":HIT,"9":HIT,"10":HIT,"A":HIT},
    7: {"2":HIT,"3":HIT,"4":HIT,"5":HIT,"6":HIT,"7":HIT,"8":HIT,"9":HIT,"10":HIT,"A":HIT},
    8: {"2":HIT,"3":HIT,"4":HIT,"5":HIT,"6":HIT,"7":HIT,"8":HIT,"9":HIT,"10":HIT,"A":HIT},

    9:{
        "2":HIT,"3":DOUBLE,"4":DOUBLE,"5":DOUBLE,"6":DOUBLE,
        "7":HIT,"8":HIT,"9":HIT,"10":HIT,"A":HIT
    },

    10:{
        "2":DOUBLE,"3":DOUBLE,"4":DOUBLE,"5":DOUBLE,"6":DOUBLE,
        "7":DOUBLE,"8":DOUBLE,"9":DOUBLE,"10":HIT,"A":HIT
    },

    11:{
        "2":DOUBLE,"3":DOUBLE,"4":DOUBLE,"5":DOUBLE,"6":DOUBLE,
        "7":DOUBLE,"8":DOUBLE,"9":DOUBLE,"10":DOUBLE,"A":HIT
    },

    12:{
        "2":HIT,"3":HIT,"4":STAND,"5":STAND,"6":STAND,
        "7":HIT,"8":HIT,"9":HIT,"10":HIT,"A":HIT
    },

    13:{
        "2":STAND,"3":STAND,"4":STAND,"5":STAND,"6":STAND,
        "7":HIT,"8":HIT,"9":HIT,"10":HIT,"A":HIT
    },

    14:{
        "2":STAND,"3":STAND,"4":STAND,"5":STAND,"6":STAND,
        "7":HIT,"8":HIT,"9":HIT,"10":HIT,"A":HIT
    },

    15:{
        "2":STAND,"3":STAND,"4":STAND,"5":STAND,"6":STAND,
        "7":HIT,"8":HIT,"9":HIT,"10":SURRENDER,"A":HIT
    },

    16:{
        "2":STAND,"3":STAND,"4":STAND,"5":STAND,"6":STAND,
        "7":HIT,"8":HIT,"9":SURRENDER,"10":SURRENDER,"A":SURRENDER
    },

    17:{
        "2":STAND,"3":STAND,"4":STAND,"5":STAND,"6":STAND,
        "7":STAND,"8":STAND,"9":STAND,"10":STAND,"A":STAND
    },

    18:{"2":STAND,"3":STAND,"4":STAND,"5":STAND,"6":STAND,"7":STAND,"8":STAND,"9":STAND,"10":STAND,"A":STAND},
    19:{"2":STAND,"3":STAND,"4":STAND,"5":STAND,"6":STAND,"7":STAND,"8":STAND,"9":STAND,"10":STAND,"A":STAND},
    20:{"2":STAND,"3":STAND,"4":STAND,"5":STAND,"6":STAND,"7":STAND,"8":STAND,"9":STAND,"10":STAND,"A":STAND},
    21:{"2":STAND,"3":STAND,"4":STAND,"5":STAND,"6":STAND,"7":STAND,"8":STAND,"9":STAND,"10":STAND,"A":STAND}

};

/*
==================================================
SOFT TOTALS
==================================================
*/

const SOFT = {

    13:{"2":HIT,"3":HIT,"4":HIT,"5":DOUBLE,"6":DOUBLE,"7":HIT,"8":HIT,"9":HIT,"10":HIT,"A":HIT},
    14:{"2":HIT,"3":HIT,"4":HIT,"5":DOUBLE,"6":DOUBLE,"7":HIT,"8":HIT,"9":HIT,"10":HIT,"A":HIT},
    15:{"2":HIT,"3":HIT,"4":DOUBLE,"5":DOUBLE,"6":DOUBLE,"7":HIT,"8":HIT,"9":HIT,"10":HIT,"A":HIT},
    16:{"2":HIT,"3":HIT,"4":DOUBLE,"5":DOUBLE,"6":DOUBLE,"7":HIT,"8":HIT,"9":HIT,"10":HIT,"A":HIT},
    17:{"2":HIT,"3":DOUBLE,"4":DOUBLE,"5":DOUBLE,"6":DOUBLE,"7":HIT,"8":HIT,"9":HIT,"10":HIT,"A":HIT},

    18:{
        "2":STAND,"3":DOUBLE,"4":DOUBLE,"5":DOUBLE,"6":DOUBLE,
        "7":STAND,"8":STAND,"9":HIT,"10":HIT,"A":HIT
    },

    19:{
        "2":STAND,"3":STAND,"4":STAND,"5":STAND,"6":DOUBLE,
        "7":STAND,"8":STAND,"9":STAND,"10":STAND,"A":STAND
    },

    20:{
        "2":STAND,"3":STAND,"4":STAND,"5":STAND,"6":STAND,
        "7":STAND,"8":STAND,"9":STAND,"10":STAND,"A":STAND
    }

};

/*
==================================================
PAIRS
==================================================
*/

const PAIRS = {

    2:{
        "2":SPLIT,"3":SPLIT,"4":SPLIT,"5":SPLIT,"6":SPLIT,
        "7":SPLIT,"8":HIT,"9":HIT,"10":HIT,"A":HIT
    },

    3:{
        "2":SPLIT,"3":SPLIT,"4":SPLIT,"5":SPLIT,"6":SPLIT,
        "7":SPLIT,"8":HIT,"9":HIT,"10":HIT,"A":HIT
    },

    4:{
        "2":HIT,"3":HIT,"4":HIT,"5":SPLIT,"6":SPLIT,
        "7":HIT,"8":HIT,"9":HIT,"10":HIT,"A":HIT
    },

    5:{
        "2":DOUBLE,"3":DOUBLE,"4":DOUBLE,"5":DOUBLE,"6":DOUBLE,
        "7":DOUBLE,"8":DOUBLE,"9":DOUBLE,"10":HIT,"A":HIT
    },

    6:{
        "2":SPLIT,"3":SPLIT,"4":SPLIT,"5":SPLIT,"6":SPLIT,
        "7":HIT,"8":HIT,"9":HIT,"10":HIT,"A":HIT
    },

    7:{
        "2":SPLIT,"3":SPLIT,"4":SPLIT,"5":SPLIT,"6":SPLIT,
        "7":SPLIT,"8":HIT,"9":HIT,"10":HIT,"A":HIT
    },

    8:{
        "2":SPLIT,"3":SPLIT,"4":SPLIT,"5":SPLIT,"6":SPLIT,
        "7":SPLIT,"8":SPLIT,"9":SPLIT,"10":SPLIT,"A":SPLIT
    },

    9:{
        "2":SPLIT,"3":SPLIT,"4":SPLIT,"5":SPLIT,"6":SPLIT,
        "7":STAND,"8":SPLIT,"9":SPLIT,"10":STAND,"A":STAND
    },

    10:{
        "2":STAND,"3":STAND,"4":STAND,"5":STAND,"6":STAND,
        "7":STAND,"8":STAND,"9":STAND,"10":STAND,"A":STAND
    },

    "A":{
        "2":SPLIT,"3":SPLIT,"4":SPLIT,"5":SPLIT,"6":SPLIT,
        "7":SPLIT,"8":SPLIT,"9":SPLIT,"10":SPLIT,"A":SPLIT
    }

};

/*
==================================================
LOOKUP
==================================================
*/

export function getCorrectMove(hand){

    if(hand.player.type === "hard"){
        return HARD[hand.player.value][hand.dealer.rank];
    }

    if(hand.player.type === "soft"){
        return SOFT[hand.player.value][hand.dealer.rank];
    }

    if(hand.player.type === "pair"){
        return PAIRS[hand.player.value][hand.dealer.rank];
    }

    return HIT;

}