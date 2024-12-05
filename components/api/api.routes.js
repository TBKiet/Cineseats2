const express = require("express");
const router = express.Router();
const apiController = require("./api.controller");

router.get("/movies", apiController.apiAllMovies);
router.get("/movies/showing", apiController.apiShowingMovies);
router.get("/movies/upcoming", apiController.apiUpcomingMovies);
module.exports = router;