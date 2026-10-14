// app.js

let activeGame = null;

// { game.id: pointValue }
let pointAssignments = {};

function selectPoints(gameID) {
    activeGame = gameID;

    // TODO: Highlight available points amounts.
}

async function loadGames() {
    const gamesResponse = await fetch("/api/games");
    const games = await gamesResponse.json();
    const selectionsResponse = await fetch("/api/selections");
    const selections = await selectionsResponse.json();

    const container = document.getElementById("games");

    games.forEach(game => {
        const matchup = document.createElement("div");
        matchup.classList.add("matchup");

        // Away
        const awayButton = document.createElement("button");
        awayButton.classList.add("team-button");

        if (selections[game.id]?.["selected-team"] === "away") {
            awayButton.classList.add("selected");
        }

        const awayName = document.createElement("span");
        awayName.textContent = game.away.name;

        const awaySpread = document.createElement("span");
        awaySpread.classList.add("spread");
        awaySpread.textContent = game.away.spread;

        awayButton.appendChild(awayName);
        awayButton.appendChild(awaySpread);

        // Home
        const homeButton = document.createElement("button");
        homeButton.classList.add("team-button");

        if (selections[game.id]?.["selected-team"] === "home") {
            homeButton.classList.add("selected");
        }

        const homeName = document.createElement("span");
        homeName.textContent = game.home.name;

        const homeSpread = document.createElement("span");
        homeSpread.classList.add("spread");
        homeSpread.textContent = game.home.spread;

        homeButton.appendChild(homeName);
        homeButton.appendChild(homeSpread);

        // Team Button Event Listeners
        awayButton.addEventListener("click", () => {
            homeButton.classList.remove("selected");
            awayButton.classList.add("selected");
            // TODO: Implement team selection logic.
        });

        homeButton.addEventListener("click", () => {
            awayButton.classList.remove("selected");
            homeButton.classList.add("selected");
            // TODO: Implement team selection logic.
        });

        // Points Button
        const pointsButton = document.createElement("button");
        pointsButton.classList.add("points-button");

        const pointsValue = document.createElement("span");
        pointsValue.classList.add("points-value");
        pointsValue.textContent = selections[game.id]?.["points-assigned"]
            ? selections[game.id]["points-assigned"]
            : "-";

        pointsButton.appendChild(pointsValue);
        pointsButton.addEventListener("click", () => {
            selectPoints(game.id)
        });

        matchup.appendChild(awayButton);
        matchup.appendChild(pointsButton);
        matchup.appendChild(homeButton);

        container.appendChild(matchup);
    });
}

loadGames();

