/*
    script.js

    UI only.
*/

let currentHand={};

function createCard(rank,suit){

    const colour=
        suit==="♥" || suit==="♦"
        ? "red"
        : "black";

    return `

    <div class="playingCard ${colour}">

        <div class="cornerTop">

            ${rank}<br>${suit}

        </div>

        <div class="centerSuit">

            ${suit}

        </div>

        <div class="cornerBottom">

            ${rank}<br>${suit}

        </div>

    </div>

    `;

}

function generateHand(){

    currentHand=generateScenario();

    document.getElementById("dealerCards").innerHTML=

        createCard(
            currentHand.dealer.rank,
            currentHand.dealer.suit
        );

    document.getElementById("playerCards").innerHTML=

        createCard(
            currentHand.cards[0].rank,
            currentHand.cards[0].suit
        )

        +

        createCard(
            currentHand.cards[1].rank,
            currentHand.cards[1].suit
        );

    document.getElementById("feedback").innerHTML=
        "Choose the correct play.";

}

function checkAnswer(move){

    const correctMove = getCorrectMove(currentHand);

    if(move === correctMove){

        document.getElementById("feedback").innerHTML =
            "✅ Correct!";

    }else{

        document.getElementById("feedback").innerHTML =
            `❌ Incorrect<br>Correct Play: <strong>${correctMove}</strong>`;

    }

}

document.getElementById("hit")
.addEventListener("click",()=>checkAnswer("Hit"));

document.getElementById("stand")
.addEventListener("click",()=>checkAnswer("Stand"));

document.getElementById("double")
.addEventListener("click",()=>checkAnswer("Double"));

document.getElementById("split")
.addEventListener("click",()=>checkAnswer("Split"));

document.getElementById("surrender")
.addEventListener("click",()=>checkAnswer("Surrender"));

document.getElementById("nextHand")
.addEventListener("click",generateHand);

generateHand();