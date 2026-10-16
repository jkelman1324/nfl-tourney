package main

import (
    "database/sql"
    "log"
    "net/http"

    _ "modernc.org/sqlite"
    "github.com/gin-gonic/gin"
)

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
    Points      *int        `json:"points-assigned,omitempty"`    
    Team        string      `json:"selected-team"`
}

var weeklySchedule  = []Game{
    {
        ID: "sea-den",
        Away: Team{Name: "Seattle Seahawks", Spread: -3.0},
        Home: Team{Name: "Denver Broncos", Spread: 3.0},
    },
    {
        ID: "hou-jax",
        Away: Team{Name: "Houston Texans", Spread: 3.0},
        Home: Team{Name: "Jacksonville Jaguars", Spread: -3.0},
    },
    {
        ID: "bal-cle",
        Away: Team{Name: "Baltimore Ravens", Spread: -3.5},
        Home: Team{Name: "Cleveland Browns", Spread: 3.5},
    },
    {
        ID: "chi-atl",
        Away: Team{Name: "Chicago Bears", Spread: 1.5},
        Home: Team{Name: "Atlanta Falcons", Spread: -1.5},
    },
    {
        ID: "car-phi",
        Away: Team{Name: "Carolina Panthers", Spread: 1.5},
        Home: Team{Name: "Philadelphia Eagles", Spread: -1.5},
    },
    {
        ID: "pit-tb",
        Away: Team{Name: "Pittsburgh Steelers", Spread: -3.0},
        Home: Team{Name: "Tampa Bay Buccaneers", Spread: 3.0},
    },
    {
        ID: "no-nyg",
        Away: Team{Name: "New Orleans Saints", Spread: 1.5},
        Home: Team{Name: "New York Giants", Spread: -1.5},
    },
    {
        ID: "nyj-ne",
        Away: Team{Name: "New York Jets", Spread: 7.0},
        Home: Team{Name: "New England Patriots", Spread: -7.0},
    },
    {
        ID: "ten-ind",
        Away: Team{Name: "Tennessee Titans", Spread: 7.0},
        Home: Team{Name: "Indianapolis Colts", Spread: -7.0},
    },
    {
        ID: "ari-lar",
        Away: Team{Name: "Arizona Cardinals", Spread: 12.5},
        Home: Team{Name: "Los Angeles Rams", Spread: -12.5},
    },
    {
        ID: "lac-kc",
        Away: Team{Name: "Los Angeles Chargers", Spread: 8.5},
        Home: Team{Name: "Kansas City Chiefs", Spread: -8.5},
    },
    {
        ID: "buf-lv",
        Away: Team{Name: "Buffalo Bills", Spread: -6.0},
        Home: Team{Name: "Las Vegas Raiders", Spread: 6.0},
    },
    {
        ID: "dal-gb",
        Away: Team{Name: "Dallas Cowboys", Spread: 1.5},
        Home: Team{Name: "Green Bay Packers", Spread: -1.5},
    },
    {
        ID: "was-sf",
        Away: Team{Name: "Washington Commanders", Spread: 7.5},
        Home: Team{Name: "San Francisco 49ers", Spread: -7.5},
    },
}

func games(c *gin.Context) {
    c.IndentedJSON(http.StatusOK, weeklySchedule)
}

var points = 7
var userSelections = map[string]Selection{
    "sea-den": Selection{Points: &points, Team: "home"},
    "dal-gb": Selection{Team: "away"},
    "buf-lv": Selection{Team: "home"},
}

func selections(c *gin.Context) {
    c.IndentedJSON(http.StatusOK, userSelections)
}

func main() {
    // Database
    db, err := sql.Open("sqlite", "./nfl-tourney.db")
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

    if err := db.Ping(); err != nil {
        log.Fatal(err)
    }

    _, err = db.Exec(`
        CREATE TABLE IF NOT EXISTS games (
            id TEXT PRIMARY KEY,
            home TEXT NOT NULL,
            away TEXT NOT NULL
        );
    `)
    if err != nil {
        log.Fatal(err)
    }

    // Web Server
    router := gin.Default()

    // Static
    router.Static("/static", "./static")
    router.StaticFile("/", "./static/index.html")

    // API
    router.GET("/api/games", games)
    router.GET("/api/selections", selections)

    router.Run("localhost:8080")
}
