
/*
    script.js

    UI only.
*/

let currentHand={};

function createCard(rank, suit){

    const redSuits = ["♥", "♦"];

    const colour = redSuits.includes(suit)
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

    const wasCorrect = (move === correctMove);

    recordHand(

        currentHand,

        move,

        correctMove,

        wasCorrect

    );

    disableActionButtons();

    if(wasCorrect){

        document.getElementById("feedback").innerHTML =
            "✅ Correct!";

        setTimeout(function(){

            generateHand();

            enableActionButtons();

        },600);

    }

    else{

        document.getElementById("feedback").innerHTML =
            `❌ Incorrect<br><br>
            Correct Play:
            <strong>${correctMove}</strong>`;

        setTimeout(function(){

            generateHand();

            enableActionButtons();

        },1400);

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

/*
==========================================
Quick Stats Navigation
==========================================
*/

document
    .getElementById("quickStats")
    .addEventListener("dblclick", function(){

        window.location.href = "stats.html";

    });
    
generateHand();

function disableActionButtons(){

    const buttons=[

        "hit",

        "stand",

        "double",

        "split",

        "surrender"

    ];

    buttons.forEach(id=>{

        document.getElementById(id).disabled=true;

    });

}

function enableActionButtons(){

    const buttons=[

        "hit",

        "stand",

        "double",

        "split",

        "surrender"

    ];

    buttons.forEach(id=>{

        document.getElementById(id).disabled=false;

    });

}