/*
==========================================
Adaptive Trainer
==========================================
*/

/*
Learning Need Score

Higher score = appears more often
Lower score = appears less often
*/

/*
==========================================
Adaptive Settings
==========================================
*/

const ADAPTIVE = {

    unseenBonus: 50,

    recentPenalty: 0.20,

    recentMemory: 15,

    minimumWeight: 1

};

/*
==========================================
Recent Scenario Memory
==========================================
*/

const recentScenarios = [];

/*
==========================================
Record Recent Scenario
==========================================
*/

function rememberScenario(id){

    recentScenarios.push(id);

    if(recentScenarios.length > ADAPTIVE.recentMemory){

        recentScenarios.shift();

    }

}



function calculateLearningNeed(decision){

    let score = 0;

    /*
    ==========================================
    Never Seen
    ==========================================
    */

    if(!decision){

        score += 100;

        return score;

    }

    const attempts = decision.handsPlayed;

    const accuracy =

        (decision.correct / attempts) * 100;

    /*
    ==========================================
    Accuracy
    ==========================================
    */

    score += (100 - accuracy);

    /*
    ==========================================
    Low Sample Bonus
    ==========================================
    */

    if(attempts < 20){

        score += (20 - attempts);

    }

    /*
    ==========================================
    Cap score
    ==========================================
    */

    if(score > 100){

        score = 100;

    }

    return Math.round(score);

}

/*
==========================================
Adaptive Pool
==========================================
*/

function buildAdaptivePool(){

    const pool = [];

    SCENARIOS.forEach(function(scenario){

        const decision =

            stats.decisionStats[scenario.id];

        pool.push({

            id: scenario.id,

            type: scenario.type,

            player: scenario.player,

            dealer: scenario.dealer,

            score: calculateLearningNeed(decision),

            stats: decision || null

        });

    });

    pool.sort(function(a,b){

        return b.score - a.score;

    });

    return pool;

}

/*
==========================================
Exposure
==========================================
*/

function getSeenScenarioCount(){

    let seen = 0;

    SCENARIOS.forEach(function(scenario){

        if(stats.decisionStats[scenario.id]){

            seen++;

        }

    });

    return seen;

}

/*
==========================================
Exposure Percentage
==========================================
*/

function getExposure(){

    return getSeenScenarioCount() /

        SCENARIOS.length;

}

/*
==========================================
Adaptive Selection
==========================================
*/

function getAdaptiveScenario(){

    const pool = buildAdaptivePool();

    const exposure = getExposure();

    let totalWeight = 0;

    /*
    ==========================================
    Calculate Weights
    ==========================================
    */

    pool.forEach(function(item){

        let weight = item.score;

        /*
==========================================
Recently Seen Penalty
==========================================
*/

if(recentScenarios.includes(item.id)){

    weight *= ADAPTIVE.recentPenalty;

}

        /*
        ==========================================
        Exposure Bonus
        ==========================================
        */

        if(item.stats === null){

            weight += (1 - exposure) * ADAPTIVE.unseenBonus;

        }

        /*
        ==========================================
        Minimum Weight
        ==========================================
        */

        weight = Math.max(

    weight,

    ADAPTIVE.minimumWeight

);

        item.weight = weight;

        totalWeight += weight;

    });

    /*
    ==========================================
    Weighted Random Selection
    ==========================================
    */

    let random = Math.random() * totalWeight;

    for(const item of pool){

        random -= item.weight;

        if(random <= 0){

            return item;

        }

    }

    return pool[0];

}

/*
==========================================
Developer Testing
==========================================
*/

function testAdaptiveSelection(times = 20){

    console.clear();

    const counts = {};

    for(let i = 0; i < times; i++){

        const scenario = getAdaptiveScenario();

        counts[scenario.id] =

            (counts[scenario.id] || 0) + 1;

    }

    console.table(counts);

}

/*
==========================================
Testing
==========================================
*/

function testAdaptivePool(){

    console.clear();

    console.table(

        buildAdaptivePool().slice(0,25)

    );

}
