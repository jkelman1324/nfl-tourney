package main

import (
    "encoding/json"
    "net/http"
)

func getGames(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(weeklySchedule)
}

func getSelections(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(userSelections)
}
