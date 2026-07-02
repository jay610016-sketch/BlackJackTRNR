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

/*
==========================================
Heat Map Move Label
==========================================
*/

function getMoveLetter(move){

    switch(move){

        case "Hit":
            return "H";

        case "Stand":
            return "S";

        case "Double":
            return "D";

        case "Split":
            return "P";

        case "Surrender":
            return "R";

        default:
            return "?";

    }

}

/*
==========================================
Heat Map Tile Colour
==========================================
*/

function getTileClass(decision){

    if(!decision){

        return "heatNeverPlayed";

    }

    const accuracy =

        (decision.correct / decision.handsPlayed) * 100;

    if(accuracy >= 90){

        return "heatExcellent";

    }

    if(accuracy >= 75){

        return "heatGood";

    }

    if(accuracy >= 50){

        return "heatAverage";

    }

    if(accuracy > 0){

        return "heatPoor";

    }

    return "heatNeverPlayed";

}

/*
==========================================
Position Heat Map Popup
==========================================
*/

function positionPopup(popup, event){

    const rect = popup.getBoundingClientRect();

    const margin = 12;

    let x = event.clientX + 18;
    let y = event.clientY + 18;

    /* Right Edge */

    if(x + rect.width > window.innerWidth - margin){

        x = event.clientX - rect.width - 18;

    }

    /* Bottom Edge */

    if(y + rect.height > window.innerHeight - margin){

        y = event.clientY - rect.height - 18;

    }

    /* Left Edge */

    if(x < margin){

        x = margin;

    }

    /* Top Edge */

    if(y < margin){

        y = margin;

    }

    popup.style.left = x + "px";
    popup.style.top = y + "px";

}

/*
==========================================
Heat Map Builder
==========================================
*/

function buildHeatMap(type){

    const rowData = {

        hard:[
            17,16,15,14,13,
            12,11,10,9,8
        ],

        soft:[
    { label:"A9", key:20 },
    { label:"A8", key:19 },
    { label:"A7", key:18 },
    { label:"A6", key:17 },
    { label:"A5", key:16 },
    { label:"A4", key:15 },
    { label:"A3", key:14 },
    { label:"A2", key:13 }
],

        pair:[

    { label:"AA", key:"A" },

    { label:"TT", key:10 },

    { label:"99", key:9 },

    { label:"88", key:8 },

    { label:"77", key:7 },

    { label:"66", key:6 },

    { label:"55", key:5 },

    { label:"44", key:4 },

    { label:"33", key:3 },

    { label:"22", key:2 }

],

    };

    const dealerCards = [

        "2","3","4","5","6",

        "7","8","9","T","A"

    ];

   const container =

    document.getElementById(

        "heatMapViewer"

    );

    container.innerHTML = "";

    const grid =

        document.createElement("div");

    grid.className = "heatMap";

    /* Empty top-left corner */

    const blank =

        document.createElement("div");

    grid.appendChild(blank);

    /* Dealer labels */

    dealerCards.forEach(function(card){

        const label =

            document.createElement("div");

        label.className =

            "dealerLabel";

        label.textContent = card;

        grid.appendChild(label);

    });

/* Rows */

rowData[type].forEach(function(row){

    const displayRow =

        typeof row === "object"

            ? row.label

            : row;

    const lookupRow =

        typeof row === "object"

            ? row.key

            : row;

    const rowLabel =

        document.createElement("div");

    rowLabel.className = "rowLabel";

    rowLabel.textContent = displayRow;

    grid.appendChild(rowLabel);

    dealerCards.forEach(function(dealer){

        const tile =

            document.createElement("div");

        tile.className = "heatTile";

        /* Dealer lookup value */

        const dealerLookup =

            dealer === "T"

                ? "10"

                : dealer;

        /* Decision ID (matches saved stats) */

        const decisionId =

            `${type}-${lookupRow}-${dealerLookup}`;

        console.log(
            decisionId,
            stats.decisionStats[decisionId]
        );

        tile.dataset.id = decisionId;

        tile.dataset.type = type;

        tile.dataset.player = displayRow;

        tile.dataset.dealer = dealer;

        /* Look up this decision */

        const decision =

            stats.decisionStats[decisionId];

        tile.classList.add(

            getTileClass(decision)

        );

        if(decision){

            tile.dataset.attempts =

                decision.handsPlayed;

            tile.dataset.correct =

                decision.correct;

            tile.dataset.incorrect =

                decision.incorrect;

            tile.dataset.accuracy =

                (

                    decision.correct /

                    decision.handsPlayed

                ) * 100;

        }

        else{

            tile.dataset.attempts = 0;

            tile.dataset.correct = 0;

            tile.dataset.incorrect = 0;

            tile.dataset.accuracy = 0;

        }

        /* Strategy letter */

        const correctMove =

            getStrategyMove(

                type,

                lookupRow,

                dealerLookup

            );

        tile.textContent =

            getMoveLetter(correctMove);

tile.addEventListener("mouseenter", function(event){

    clearTimeout(heatMapHoverTimer);

    heatMapHoverTimer = setTimeout(function(){

        const popup =

            document.getElementById("heatMapPopup");

        popup.style.display = "block";

        popup.style.opacity = "1";

        popup.style.transform = "translateY(0)";

        popup.innerHTML = `

    <div class="popupType">

        ${type.toUpperCase()} HAND

    </div>

    <div class="popupTitle">

        ${displayRow} vs Dealer ${dealer}

    </div>

    <div class="popupDivider"></div>

    <div class="popupBestLabel">

        Best Play

    </div>

    <div class="popupBest">

        ${correctMove}

    </div>

    <div class="popupDivider"></div>

    <div class="popupGrid">

        <div>

            <div class="popupStatLabel">

                Accuracy

            </div>

            <div class="popupStatValue">

                ${Number(tile.dataset.accuracy).toFixed(1)}%

            </div>

        </div>

        <div>

            <div class="popupStatLabel">

                Attempts

            </div>

            <div class="popupStatValue">

                ${tile.dataset.attempts}

            </div>

        </div>

        <div>

            <div class="popupStatLabel">

                Correct

            </div>

            <div class="popupStatValue">

                ${tile.dataset.correct}

            </div>

        </div>

        <div>

            <div class="popupStatLabel">

                Incorrect

            </div>

            <div class="popupStatValue">

                ${tile.dataset.incorrect}

            </div>

        </div>

    </div>

    <div class="popupFooter">

        ${
            Number(tile.dataset.attempts) === 0

                ? "No data yet"

                : Number(tile.dataset.attempts) < 5

                    ? "⚠ Low sample size"

                    : Number(tile.dataset.attempts) < 20

                        ? "Building confidence"

                        : "✓ Statistically meaningful"
        }

    </div>

`;

        positionPopup(

            popup,

            event

        );

    },250);

});

tile.addEventListener("mousemove", function(event){

    const popup =

        document.getElementById("heatMapPopup");

    positionPopup(popup, event);

});


tile.addEventListener("mouseleave", function(){

    clearTimeout(heatMapHoverTimer);

    const popup =

        document.getElementById("heatMapPopup");

    popup.style.opacity = "0";

    popup.style.transform =

        "translateY(8px)";

    setTimeout(function(){

        popup.style.display = "none";

    },150);

});

        grid.appendChild(tile);

    });

});

    container.appendChild(grid);

}

/*
==========================================
Heat Map Selection
==========================================
*/

const handCards =

    document.querySelectorAll(".handTypeCard");

handCards.forEach(function(card){

    card.addEventListener("click",function(){

        // Remove active state from all cards

        handCards.forEach(function(other){

            other.classList.remove("active");

        });

        // Highlight selected card

        card.classList.add("active");

        // Build the selected heat map

        buildHeatMap(

            card.dataset.type

        );

    });

});

/*
==========================================
Heat Map Hover Timer
==========================================
*/

let heatMapHoverTimer = null;
