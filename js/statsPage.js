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

    updateHistory();

}

/*
==========================================
Summary Cards
==========================================
*/

function updateSummary(){

    document.getElementById("accuracy").innerHTML =
        getAccuracy().toFixed(1) + "%";

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