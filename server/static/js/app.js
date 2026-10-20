// app.js

import { getGames, getSelections } from "./api.js";
import { state, setInitialState } from "./state.js";

function createMatchup(game, selections) {
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
        : `+${game.home.spread}`;

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
    const matchupPointsAssignedButton = document.createElement("button");
    matchupPointsAssignedButton.classList.add("points-assigned-button");
    matchupPointsAssignedButton.id = game.id;

    if (selections[game.id]?.["points-assigned"] != null) {
        matchupPointsAssignedButton.textContent = selections[game.id]["points-assigned"];
        matchupPointsAssignedButton.dataset.pointsAssigned = selections[game.id]["points-assigned"];
    } else {
        matchupPointsAssignedButton.textContent = "-";
    }

    matchupPointsAssignedButton.addEventListener("click", (event) => {
        if (state.selectedPoints != null) {
            // Update state.
            state.selectedPoints = null;

            if (event.currentTarget.dataset.pointsAssigned != null) {
                document.querySelector(`.points-options-button[data-points="${event.currentTarget.dataset.pointsAssigned}"]`).disabled = false;
            }

            let pointsButtonSelected = document.querySelector(".points-options-button.selected");
            event.currentTarget.textContent = pointsButtonSelected.dataset.points;
            event.currentTarget.dataset.pointsAssigned = pointsButtonSelected.dataset.points;
            pointsButtonSelected.classList.remove("selected");
            pointsButtonSelected.disabled = true;
        } else if (state.removePointsMode) {
            // Update state.
            state.removePointsMode = false;

            if (event.currentTarget.dataset.pointsAssigned != null) {
                document.querySelector(`.points-options-button[data-points="${event.currentTarget.dataset.pointsAssigned}"]`).disabled = false;
            }

            event.currentTarget.textContent = "-";
            delete event.currentTarget.dataset.pointsAssigned;
            document.querySelector(".remove-points-button").classList.remove("selected");
        } else {
            if (state.selectedMatchupId != null) {
                document.querySelector(".points-assigned-button.selected").classList.remove("selected");
            }

            // Update state.
            state.selectedMatchupId = event.currentTarget.id;

            event.currentTarget.classList.add("selected");
        }
    });

    matchup.append(awayButton, matchupPointsAssignedButton, homeButton);

    return matchup;
}

function createMatchups(games, selections) {
    const gamesContainer = document.querySelector(".games");

    games.forEach(game => {
        gamesContainer.appendChild(
            createMatchup(game, selections)
        );
    });
}

function createPointsOptionsButtons(games, selections) {
    const pointsContainer = document.querySelector(".points-buttons");
    for (let i = 0; i < games.length; i++) {
        const pointsOptionButton = document.createElement("button");
        pointsOptionButton.classList.add("points-options-button");
        pointsOptionButton.textContent = i + 1;
        pointsOptionButton.dataset.points = i + 1;
        pointsContainer.appendChild(pointsOptionButton);

        if (Object.values(selections).some(selection => selection["points-assigned"] === i + 1)) {
            pointsOptionButton.disabled = true;
        }

        pointsOptionButton.addEventListener("click", () => {
            if (state.selectedMatchupId != null) {
                // TODO: Send selection update to backend.
                // Re-enable overwritten points value if necessary.
                let activeGame = document.querySelector(".points-assigned-button.selected")
                if (activeGame.dataset.pointsAssigned != null) {
                    document.querySelector(`.points-options-button[data-points="${activeGame.dataset.pointsAssigned}"]`).disabled = false;
                }

                // Update state.
                state.selectedMatchupId = null;

                activeGame.textContent = i + 1;
                activeGame.dataset.pointsAssigned = i + 1;
                activeGame.classList.remove("selected");
                event.currentTarget.disabled = true;
            } else {
                if (state.selectedPoints != null) {
                    let pointsOptionSelected = document.querySelector(".points-options-button.selected");
                    pointsOptionSelected.classList.remove("selected");
                }

                // Update state.
                state.selectedPoints = i + 1;

                event.currentTarget.classList.add("selected");
            }
        });
    }

    // Remove Points Button
    const removePointsButton = document.createElement("button");
    removePointsButton.textContent = "X";
    removePointsButton.classList.add("remove-points-button");

    removePointsButton.addEventListener("click", (event) => {
        if (state.selectedMatchupId != null) {
            // TODO: Send selection removal update to backend.
            // Update state.
            state.removePointsMode = false;

            let activeGame = document.querySelector(".points-assigned-button.selected");
            activeGame.textContent = "-";
            activeGame.classList.remove("selected");
            document.querySelector(`.points-options-button[data-points="${activeGame.dataset.pointsAssigned}"]`).disabled = false;
            delete activeGame.dataset.pointsAssigned;
        } else {
            // Update state.
            state.removePointsMode = true;

            event.currentTarget.classList.add("selected");
        }
    });

    pointsContainer.appendChild(removePointsButton);
}

async function load() {
    try {
        const [games, selections] = await Promise.all([
            getGames(),
            getSelections()
        ]);

        setInitialState(games, selections);

        createPointsOptionsButtons(state.games, state.selections);
        createMatchups(state.games, state.selections);
    } catch (error) {
        console.error("Failed to initialize app:", error);
    }
}

load();

