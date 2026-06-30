function randomItem(array){

    return array[Math.floor(Math.random()*array.length)];

}

function formatPlayerHand(hand){

    if(hand.type==="hard"){

        return "Hard " + hand.total;

    }

    if(hand.type==="soft"){

        return "Soft " + hand.total;

    }

    if(hand.type==="pair"){

        return "Pair of " + hand.rank + "s";

    }

}

function generateHand(){

    const dealer = randomItem(dealerCards);

    const player = randomItem(practiceHands);

    document.getElementById("dealer").textContent =
        "Dealer: " + dealer;

    document.getElementById("player").textContent =
        "Player: " + formatPlayerHand(player);

    document.getElementById("feedback").textContent =
        "Choose the correct play.";

}

generateHand();

document
.getElementById("nextHand")
.addEventListener("click",generateHand);