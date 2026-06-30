const dealerCards = [
    "2","3","4","5","6","7","8","9","10","A"
];

const hardTotals = [];

for(let total = 5; total <= 21; total++){

    hardTotals.push({
        type:"hard",
        total:total
    });

}

const softTotals = [];

for(let total = 13; total <= 20; total++){

    softTotals.push({
        type:"soft",
        total:total
    });

}

const pairHands = [
    2,3,4,5,6,7,8,9,10,"A"
].map(rank => ({
    type:"pair",
    rank:rank
}));

const practiceHands = [
    ...hardTotals,
    ...softTotals,
    ...pairHands
];