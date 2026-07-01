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

    history:[]

}

/*
==========================================
Load
==========================================
*/

function loadStats(){

    const saved = localStorage.getItem(STORAGE_KEY);

    if(saved){

        stats = JSON.parse(saved);

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

        handsPlayed: 0,

        correct: 0,

        incorrect: 0,

        currentStreak: 0,

        bestStreak: 0,

        history: []

    };

    saveStats();

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

    // Update Overall Statistics

    stats.overall.handsPlayed++;

    stats[category].handsPlayed++;

    if(wasCorrect){

        stats.overall.correct++;

        stats[category].correct++;

        stats.currentStreak++;

        if(stats.currentStreak > stats.bestStreak){

            stats.bestStreak = stats.currentStreak;

        }

    }

    else {

        stats.overall.incorrect++;

        stats[category].incorrect++;

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