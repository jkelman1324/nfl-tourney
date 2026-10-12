package main

import (
    "net/http"

    "github.com/gin-gonic/gin"
)

type Team struct {
    Name    string  `json:"name"`
    Spread  string  `json:"point"`
}

type game struct {
    ID          string  `json:"id"`
    Home        Team    `json:"home"`
    Away        Team    `json:"away"`
}

var weeklySchedule  = []game{
    {ID: "1", Title: "Blue Train", Artist: "John Coltrane", Price: 56.99},
    {ID: "2", Title: "Jeru", Artist: "Gerry Mulligan", Price: 17.99},
    {ID: "3", Title: "Sarah Vaughan and Clifford Brown", Artist: "Sarah Vaughan", Price: 39.99},
}

func helloWorld(c *gin.Context) {
    c.IndentedJSON(http.StatusOK, albums)
}

func main() {
    router := gin.Default()
    router.GET("/hello", helloWorld)

    router.Run("localhost:8080")
}
