/*
==========================================
stats.js

Handles:

- Session statistics
- History
- localStorage

==========================================
*/

const STORAGE_KEY = "blackjacktrnr_stats";

let stats = {

    overall:{

        handsPlayed:0,
        correct:0,
        incorrect:0

    },

    hard:{

        handsPlayed:0,
        correct:0,
        incorrect:0

    },

    soft:{

        handsPlayed:0,
        correct:0,
        incorrect:0

    },

    pair:{

        handsPlayed:0,
        correct:0,
        incorrect:0

    },

    currentStreak:0,

    bestStreak:0,

    history:[],
    
    decisionStats:{}

};

/*
==========================================
Load
==========================================
*/

function loadStats(){

    const saved = localStorage.getItem(STORAGE_KEY);

    if(saved){

        const loaded = JSON.parse(saved);

        // Check if this is an old save format

        if(!loaded.overall){

            resetStats();

            return;

        }

        stats = loaded;

    }

}

/*
==========================================
Save
==========================================
*/

function saveStats(){

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(stats)

    );

}

/*
==========================================
Reset
==========================================
*/

function resetStats(){

    stats = {

        overall:{

            handsPlayed:0,
            correct:0,
            incorrect:0

        },

        hard:{

            handsPlayed:0,
            correct:0,
            incorrect:0

        },

        soft:{

            handsPlayed:0,
            correct:0,
            incorrect:0

        },

        pair:{

            handsPlayed:0,
            correct:0,
            incorrect:0

        },

        currentStreak:0,

        bestStreak:0,

        history:[],
        
        decisionStats:{}

    };

    saveStats();

    updateQuickStats();

}

/*
==========================================
Accuracy
==========================================
*/

function getAccuracy(category = "overall"){

    const section = stats[category];

    if(section.handsPlayed === 0){

        return 0;

    }

    return (

        section.correct /

        section.handsPlayed

    ) * 100;

}

/*
==========================================
Decision ID
==========================================
*/

function getDecisionId(hand){

    return `${hand.player.type}-${hand.player.value}-${hand.dealer.rank}`;

}

/*
==========================================
Record Hand
==========================================
*/

function recordHand(

    hand,

    playerAnswer,

    correctAnswer,

    wasCorrect

) {

    // Determine which category this hand belongs to

    const category = hand.player.type;

    const decisionId = getDecisionId(hand);

// Create the decision if it doesn't exist yet

if(!stats.decisionStats[decisionId]){

    stats.decisionStats[decisionId]={

        handsPlayed:0,

        correct:0,

        incorrect:0

    };

}

    // Update Overall Statistics

    stats.overall.handsPlayed++;
    
    stats[category].handsPlayed++;
    
    stats.decisionStats[decisionId].handsPlayed++;

    if(wasCorrect){

        stats.overall.correct++;

        stats[category].correct++;

        stats.decisionStats[decisionId].correct++;

        stats.currentStreak++;

        if(stats.currentStreak > stats.bestStreak){

            stats.bestStreak = stats.currentStreak;

        }

    }

    else {

        stats.overall.incorrect++;

        stats[category].incorrect++;

        stats.decisionStats[decisionId].incorrect++;

        stats.currentStreak = 0;

    }

    stats.history.unshift({

        timestamp: new Date().toLocaleTimeString(),

        playerType: hand.player.type,

        playerValue: hand.player.value,

        dealer: hand.dealer.rank,

        cards: [

            {

                rank: hand.cards[0].rank,

                suit: hand.cards[0].suit

            },

            {

                rank: hand.cards[1].rank,

                suit: hand.cards[1].suit

            }

        ],

        playerAnswer: playerAnswer,

        correctAnswer: correctAnswer,

        wasCorrect: wasCorrect

    });

    if(stats.history.length > 50){

        stats.history.pop();

    }

    updateQuickStats();

    saveStats();

}

/*
==========================================
Most Missed Hands
==========================================
*/

function getMostMissedHands(limit = 10){

    const decisions = [];

    for(const id in stats.decisionStats){

        const hand = stats.decisionStats[id];

        if(hand.handsPlayed < 2){

            continue;

        }

        decisions.push({

            id:id,

            accuracy:
                (hand.correct / hand.handsPlayed) * 100,

            handsPlayed:
                hand.handsPlayed,

            correct:
                hand.correct,

            incorrect:
                hand.incorrect

        });

    }

    decisions.sort(function(a,b){

        if(a.accuracy === b.accuracy){

            return b.handsPlayed - a.handsPlayed;

        }

        return a.accuracy - b.accuracy;

    });

    return decisions.slice(0,limit);

}

/*
==========================================
Public
==========================================
*/

loadStats();

updateQuickStats();

/*
==========================================
Update Quick Stats
==========================================
*/

function updateQuickStats(){

    const accuracy =
        getAccuracy("overall").toFixed(1);

    const accuracyElement =
        document.getElementById("accuracy");

    const handsElement =
        document.getElementById("handsPlayed");

    const streakElement =
        document.getElementById("streak");

    if(accuracyElement){

        accuracyElement.textContent =
            `${accuracy}%`;

    }

    if(handsElement){

        handsElement.textContent =
            stats.overall.handsPlayed;

    }

    if(streakElement){

        streakElement.textContent =
            stats.currentStreak;

    }

}