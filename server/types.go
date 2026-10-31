package main

type Team struct {
    Name        string      `json:"name"`
    Spread      float64     `json:"spread"`
}

type Game struct {
    ID          string      `json:"id"`
    Home        Team        `json:"home"`
    Away        Team        `json:"away"`
    Result      *string     `json:"result,omitempty"`
}

type Selection struct {
    Points      int         `json:"points-assigned,omitempty"`
    Team        string      `json:"selected-team"`
}


