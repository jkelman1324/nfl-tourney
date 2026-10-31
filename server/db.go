package main

import (
    "log"
    "database/sql"
)

func createTables(db *sql.DB) {
    _, err := db.Exec(`
        CREATE TABLE IF NOT EXISTS games (
            id TEXT PRIMARY KEY,
            home TEXT NOT NULL,
            away TEXT NOT NULL
        );
    `)
    if err != nil {
        log.Fatal(err)
    }
}

func initializeDatabase() {
    db, err := sql.Open("sqlite", "./nfl-tourney.db")
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

    if err := db.Ping(); err != nil {
        log.Fatal(err)
    }

    createTables(db);
} 
