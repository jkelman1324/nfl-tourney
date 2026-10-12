// app.js

async function loadGames() {
    const response = await fetch("/api/games");
    const games = await response.json();

    const container = document.getElementById("games");

    games.forEach(game => {
        const matchup = document.createElement("div");

        matchup.textContent =
            `${game.away.name} (${game.away.spread}) @ ` +
            `${game.home.name} (${game.home.spread})`;

        container.appendChild(matchup);
    });
}

loadGames();

