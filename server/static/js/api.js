// api.js

export async function getGames() {
    const response = await fetch("/api/games");

    if (!response.ok) {
        throw new Error(`Failed to fetch games: ${response.status}`);
    }

    return response.json();
}

export async function getSelections() {
    const response = await fetch("/api/selections");

    if (!response.ok) {
        throw new Error(`Failed to fetch selections: ${response.status}`);
    }

    return response.json();
}
