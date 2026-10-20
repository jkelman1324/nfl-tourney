// state.js

export const state = {
    games: [],
    selections: {},
    selectedMatchupId: null,
    selectedPoints: null,
    removePointsMode: false
};

export function setInitialState(games, selections) {
    state.games = games;
    state.selections = selections;
}
