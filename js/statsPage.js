/*
==========================================
statsPage.js

Controls the Performance page.
==========================================
*/

updatePage();

document
    .getElementById("resetStats")
    .addEventListener("click", resetAllStats);

/*
==========================================
Update Page
==========================================
*/

function updatePage(){

    updateSummary();

    updateMostMissedHands();

    updateHistory();

}

/*
==========================================
Summary Cards
==========================================
*/

function updateSummary(){

    // =========================
    // Summary Cards
    // =========================

    document.getElementById("accuracy").innerHTML =
        getAccuracy("overall").toFixed(1) + "%";

    document.getElementById("handsPlayed").innerHTML =
        stats.overall.handsPlayed;

    document.getElementById("correct").innerHTML =
        stats.overall.correct;

    document.getElementById("incorrect").innerHTML =
        stats.overall.incorrect;

    document.getElementById("currentStreak").innerHTML =
        stats.currentStreak;

    document.getElementById("bestStreak").innerHTML =
        stats.bestStreak;

    // =========================
    // Performance by Hand Type
    // =========================

    document.getElementById("hardAccuracy").innerHTML =
        getAccuracy("hard").toFixed(1) + "%";

    document.getElementById("softAccuracy").innerHTML =
        getAccuracy("soft").toFixed(1) + "%";

    document.getElementById("pairAccuracy").innerHTML =
        getAccuracy("pair").toFixed(1) + "%";

}

/*
==========================================
Most Missed Hands
==========================================
*/

function updateMostMissedHands(){

    const container =
        document.getElementById("mostMissedHands");

    container.innerHTML = "";

    const hands =
        getMostMissedHands(5);

    if(hands.length === 0){

        container.innerHTML =

            `
            <div class="historyCard">

                Play more hands to generate data.

            </div>
            `;

        return;

    }

    hands.forEach(function(hand){

        const card =
            document.createElement("div");

        card.className = "historyCard";

        const parts = hand.id.split("-");

        const type =
            parts[0];

        const player =
            parts[1];

        const dealer =
            parts[2];

        let title = "";

        if(type === "hard"){

          title =
          `Hard ${player} VS ${dealer}`;
        
        }

        else if(type === "soft"){

            title =
                `Soft ${player} VS Dealer ${dealer}`;

        }

        else{

            title =
                `Pair ${player}s vs Dealer ${dealer}`;

        }

        card.innerHTML =

        `
        <div class="historyTitle">

            ${title}

        </div>

        <div class="historyAnswer">

            Accuracy:
            <strong>

            ${hand.accuracy.toFixed(1)}%

            </strong>

        </div>

        <div class="historyAnswer">

    ${hand.correct} Correct • ${hand.incorrect} Incorrect

</div>

<div class="historyTime">

    ${hand.handsPlayed} Attempts

</div>
        `;

        container.appendChild(card);

    });

}

/*
==========================================
History
==========================================
*/

function updateHistory(){

    const history =
        document.getElementById("history");

    history.innerHTML = "";

    if(stats.history.length === 0){

        history.innerHTML =

            `
            <div class="historyCard">

                No hands played yet.

            </div>
            `;

        return;

    }

    stats.history.forEach(hand=>{

        const card =
            document.createElement("div");

        card.className =
            "historyCard";

        if(!hand.wasCorrect){

            card.classList.add(
                "incorrect"
            );

        }

        let title =
            "";

        if(hand.playerType==="hard"){

            title =
                `Hard ${hand.playerValue} vs Dealer ${hand.dealer}`;

        }

        if(hand.playerType==="soft"){

            title =
                `Soft ${hand.playerValue} vs Dealer ${hand.dealer}`;

        }

        if(hand.playerType==="pair"){

            title =
                `Pair ${hand.playerValue}s vs Dealer ${hand.dealer}`;

        }

        card.innerHTML =

        `
        <div class="historyTitle">

            ${hand.wasCorrect ? "✅" : "❌"}

            ${title}

        </div>

        <div class="historyAnswer">

            <strong>Your Answer:</strong>

            ${hand.playerAnswer}

        </div>

        ${
            hand.wasCorrect

            ?

            ""

            :

            `<div class="historyWrong">

                <strong>Correct:</strong>

                ${hand.correctAnswer}

            </div>`

        }

        <div class="historyTime">

            ${hand.timestamp}

        </div>
        `;

        history.appendChild(card);

    });

}

/*
==========================================
Reset
==========================================
*/

function resetAllStats(){

    const confirmReset =
        confirm(
            "Reset all statistics?"
        );

    if(!confirmReset){

        return;

    }

    resetStats();

    updatePage();

}