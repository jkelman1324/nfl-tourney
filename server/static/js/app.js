// app.js

async function load() {
    const gamesResponse = await fetch("/api/games");
    const games = await gamesResponse.json();

    const selectionsResponse = await fetch("/api/selections");
    const selections = await selectionsResponse.json();

    // Points Options Buttons
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
            let activeGame = document.querySelector(".points-assigned-button.selected")
            if (activeGame) {
                // TODO: Send selection update to backend.
                // Re-enable overwritten points value.
                if (activeGame.dataset.pointsAssigned != null) {
                    document.querySelector(`.points-options-button[data-points="${activeGame.dataset.pointsAssigned}"]`).removeAttribute("disabled");
                }

                activeGame.textContent = i + 1;
                activeGame.dataset.pointsAssigned = i + 1;
                activeGame.classList.remove("selected");
                pointsOptionButton.disabled = true;
            } else {
                let pointsOptionSelected = document.querySelector(".points-options-button.selected");
                if (pointsOptionSelected) {
                    pointsOptionSelected.classList.remove("selected");
                }

                pointsOptionButton.classList.add("selected");
            }
        });
    }

    // Remove Points Button
    const removePointsButton = document.createElement("button");
    removePointsButton.textContent = "X";
    removePointsButton.classList.add("remove-points-button");

    removePointsButton.addEventListener("click", (event) => {
        let activeGame = document.querySelector(".points-assigned-button.selected");
        console.log(activeGame);
        if (activeGame) {
            // TODO: Send selection removal update to backend.
            activeGame.textContent = "-";
            activeGame.classList.remove("selected");
            document.querySelector(`.points-options-button[data-points="${activeGame.dataset.pointsAssigned}"]`).removeAttribute("disabled");
            delete activeGame.dataset.pointsAssigned;
        } else {
            event.srcElement.classList.add("selected");
        }
    });

    pointsContainer.appendChild(removePointsButton);

    // Games
    const gamesContainer = document.querySelector(".games");
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
            let pointsButtonSelected = document.querySelector(".points-options-button.selected");
            if (pointsButtonSelected != null) {
                event.srcElement.textContent = pointsButtonSelected.dataset.points;

                if (event.srcElement.dataset.pointsAssigned != null) {
                    document.querySelector(`.points-options-button[data-points="${event.srcElement.dataset.pointsAssigned}"]`).disabled = false;
                }

                event.srcElement.dataset.pointsAssigned = pointsButtonSelected.dataset.points;
                pointsButtonSelected.classList.remove("selected");
                pointsButtonSelected.disabled = true;
            } else if (document.querySelector(".remove-points-button.selected")) {
                event.srcElement.textContent = "-";

                if (event.srcElement.dataset.pointsAssigned != null) {
                    document.querySelector(`.points-options-button[data-points="${event.srcElement.dataset.pointsAssigned}"]`).disabled = false;
                }

                delete event.srcElement.dataset.pointsAssigned;
                document.querySelector(".remove-points-button").classList.remove("selected");
            } else {
                let matchupSelected = document.querySelector(".points-assigned-button.selected");
                if (matchupSelected != null) {
                    matchupSelected.classList.remove("selected");
                }

                event.srcElement.classList.add("selected");
            }
        });

        matchup.appendChild(awayButton);
        matchup.appendChild(matchupPointsAssignedButton);
        matchup.appendChild(homeButton);

        gamesContainer.appendChild(matchup);
    });
}

load();

