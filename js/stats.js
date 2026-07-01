/*
==========================================
stats.js

Handles:

- Statistics
- History
- Analytics
- Local Storage

==========================================
*/

/*
==========================================
Constants
==========================================
*/

const STORAGE_KEY = "blackjacktrnr_stats";

/*
==========================================
Stats Structure
==========================================
*/

function createEmptyStats(){

    return{

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

}

let stats = createEmptyStats();

/*
==========================================
Storage
==========================================
*/

function loadStats(){

    const saved =
        localStorage.getItem(STORAGE_KEY);

    if(!saved){

        return;

    }

    const loaded =
        JSON.parse(saved);

    if(!loaded.overall){

        resetStats();

        return;

    }

    stats = loaded;

}

function saveStats(){

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(stats)

    );

}

function resetStats(){

    stats = createEmptyStats();

    saveStats();

    updateQuickStats();

}

/*
==========================================
Helpers
==========================================
*/

function getAccuracy(category="overall"){

    const section = stats[category];

    if(section.handsPlayed===0){

        return 0;

    }

    return (

        section.correct /

        section.handsPlayed

    )*100;

}

function getDecisionId(hand){

    return `${hand.player.type}-${hand.player.value}-${hand.dealer.rank}`;

}

/*
==========================================
Analytics
==========================================
*/

function getMostMissedHands(limit=10){

    const decisions=[];

    for(const id in stats.decisionStats){

        const hand =
            stats.decisionStats[id];

        if(hand.handsPlayed < 2){

            continue;

        }

        decisions.push({

            id:id,

            accuracy:

                (hand.correct / hand.handsPlayed)*100,

            handsPlayed:
                hand.handsPlayed,

            correct:
                hand.correct,

            incorrect:
                hand.incorrect

        });

    }

    decisions.sort(function(a,b){

        if(a.accuracy===b.accuracy){

            return b.handsPlayed-a.handsPlayed;

        }

        return a.accuracy-b.accuracy;

    });

    return decisions.slice(0,limit);

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

){

    const category =
        hand.player.type;

    const decisionId =
        getDecisionId(hand);

    if(!stats.decisionStats[decisionId]){

        stats.decisionStats[decisionId]={

            handsPlayed:0,

            correct:0,

            incorrect:0

        };

    }

    const decision =
        stats.decisionStats[decisionId];

    stats.overall.handsPlayed++;

    stats[category].handsPlayed++;

    decision.handsPlayed++;

    if(wasCorrect){

        stats.overall.correct++;

        stats[category].correct++;

        decision.correct++;

        stats.currentStreak++;

        if(stats.currentStreak >

            stats.bestStreak){

            stats.bestStreak =

                stats.currentStreak;

        }

    }

    else{

        stats.overall.incorrect++;

        stats[category].incorrect++;

        decision.incorrect++;

        stats.currentStreak=0;

    }

    stats.history.unshift({

        timestamp:

            new Date().toLocaleTimeString(),

        playerType:
            hand.player.type,

        playerValue:
            hand.player.value,

        dealer:
            hand.dealer.rank,

        cards:[

            {

                rank:
                    hand.cards[0].rank,

                suit:
                    hand.cards[0].suit

            },

            {

                rank:
                    hand.cards[1].rank,

                suit:
                    hand.cards[1].suit

            }

        ],

        playerAnswer,

        correctAnswer,

        wasCorrect

    });

    if(stats.history.length>50){

        stats.history.pop();

    }

    updateQuickStats();

    saveStats();

}

/*
==========================================
UI
==========================================
*/

function updateQuickStats(){

    const accuracyElement =
        document.getElementById("accuracy");

    const handsElement =
        document.getElementById("handsPlayed");

    const streakElement =
        document.getElementById("streak");

    if(accuracyElement){

        accuracyElement.textContent =

            `${getAccuracy().toFixed(1)}%`;

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

/*
==========================================
Initialization
==========================================
*/

loadStats();

updateQuickStats();

