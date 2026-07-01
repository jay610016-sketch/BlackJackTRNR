/*
==========================================
script.js

Controls the Trainer UI
==========================================
*/

/*
==========================================
Current Hand
==========================================
*/

let currentHand = {};

/*
==========================================
Card Rendering
==========================================
*/

function createCard(rank, suit){

    const colour =

        ["♥","♦"].includes(suit)

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

/*
==========================================
Generate Hand
==========================================
*/

function generateHand(){

    currentHand = generateScenario();

    document.getElementById("dealerCards").innerHTML =

        createCard(

            currentHand.dealer.rank,

            currentHand.dealer.suit

        );

    document.getElementById("playerCards").innerHTML =

        createCard(

            currentHand.cards[0].rank,

            currentHand.cards[0].suit

        )

        +

        createCard(

            currentHand.cards[1].rank,

            currentHand.cards[1].suit

        );

    document.getElementById("feedback").innerHTML =

        "Choose the correct play.";

}

/*
==========================================
Answer Checking
==========================================
*/

function checkAnswer(move){

    const correctMove =

        getCorrectMove(currentHand);

    const wasCorrect =

        move === correctMove;

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

/*
==========================================
Button Helpers
==========================================
*/

function disableActionButtons(){

    const buttons = [

        "hit",

        "stand",

        "double",

        "split",

        "surrender"

    ];

    buttons.forEach(function(id){

        document.getElementById(id).disabled = true;

    });

}

function enableActionButtons(){

    const buttons = [

        "hit",

        "stand",

        "double",

        "split",

        "surrender"

    ];

    buttons.forEach(function(id){

        document.getElementById(id).disabled = false;

    });

}

/*
==========================================
Desktop Buttons
==========================================
*/

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
Mobile Buttons
==========================================
*/

document.getElementById("mobileHit")
?.addEventListener("click",()=>checkAnswer("Hit"));

document.getElementById("mobileStand")
?.addEventListener("click",()=>checkAnswer("Stand"));

document.getElementById("mobileDouble")
?.addEventListener("click",()=>checkAnswer("Double"));

document.getElementById("mobileSplit")
?.addEventListener("click",()=>checkAnswer("Split"));

document.getElementById("mobileSurrender")
?.addEventListener("click",()=>checkAnswer("Surrender"));

document.getElementById("mobileNextHand")
?.addEventListener("click",generateHand);

/*
==========================================
Quick Stats Navigation
==========================================
*/

document.getElementById("quickStats")
.addEventListener("dblclick",function(){

    window.location.href = "stats.html";

});

/*
==========================================
Initialization
==========================================
*/

generateHand();

