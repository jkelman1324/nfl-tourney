// app.js

let activeGame = null;
let assignPointsMode = false;
let selectedPoints = null;

// { game.id: pointValue }
let pointAssignments = {};

function selectPoints(gameID, points) {
    activeGame = gameID;
    assignPointsMode = true;

    if (points !== "-") {
        selectedPoints = points;
    }

    // TODO: Highlight available points amounts.
}

async function load() {
    const gamesResponse = await fetch("/api/games");
    const games = await gamesResponse.json();

    const selectionsResponse = await fetch("/api/selections");
    const selections = await selectionsResponse.json();

    // Points Options Buttons
    const pointsContainer = document.getElementById("pointsOptions");
    for (let i = 0; i < games.length; i++) {
        const pointsOptionButton = document.createElement("button");
        pointsOptionButton.textContent = i + 1;
        pointsOptionButton.dataset.points = i + 1;
        pointsContainer.appendChild(pointsOptionButton);

        if (Object.values(selections).some(selection => selection["points-assigned"] === i + 1)) {
            pointsOptionButton.disabled = true;
        }

        pointsOptionButton.addEventListener("click", () => {
            if (assignPointsMode) {
                // TODO: Send selection update to backend.
                document.getElementById(activeGame).textContent = i + 1;
                pointsOptionButton.disabled = true;
                assignPointsMode = false;
            }
        });
    }

    // Remove Points Button
    const removePointsButton = document.createElement("button");
    removePointsButton.textContent = "X";
    removePointsButton.id = "remove-points";

    removePointsButton.addEventListener("click", () => {
        if (assignPointsMode && selectedPoints) {
            // TODO: Send selection removal update to backend.
            document.getElementById(activeGame).textContent = "-";
            document.querySelector(`[data-points="${selectedPoints}"]`).disabled = false;
            assignPointsMode = false;
            selectedPoints = null;
        }
    });

    pointsContainer.appendChild(removePointsButton);

    // Games
    const gamesContainer = document.getElementById("games");
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
        awaySpread.textContent = game.away.spread < 0
            ? game.away.spread
            : `+${game.away.spread}`;

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
        homeSpread.textContent = game.home.spread < 0
            ? game.home.spread
            : `+${game.away.spread}`;

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

        // Matchup Points Button
        const pointsButton = document.createElement("button");
        pointsButton.classList.add("points-button");

        const pointsValue = document.createElement("span");
        pointsValue.classList.add("points-value");
        pointsValue.id = game.id
        pointsValue.textContent = selections[game.id]?.["points-assigned"]
            ? selections[game.id]["points-assigned"]
            : "-";

        pointsButton.appendChild(pointsValue);
        pointsButton.addEventListener("click", () => {
            selectPoints(game.id, pointsValue.textContent);
        });

        matchup.appendChild(awayButton);
        matchup.appendChild(pointsButton);
        matchup.appendChild(homeButton);

        gamesContainer.appendChild(matchup);
    });
}

load();

