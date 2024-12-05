const {getMovieListsByType} = require("../../utility/movie");
const {getPageFromReq, getQueryFromReq} = require("../../utility/extractRequest");

function apiAllMovies(req, res) {
    const page = getPageFromReq(req);
    const query = getQueryFromReq(req);
    getMovieListsByType("all", page, 8, query)
        .then((movies) => res.json(movies))
        .catch((error) => {
            console.error("Error loading movies:", error);
            res.status(500).send("Error loading movies.");
        });
}

function apiShowingMovies(req, res) {
    const page = getPageFromReq(req);
    const query = getQueryFromReq(req);
    getMovieListsByType("showing", page, 8, query)
        .then((movies) => res.json(movies))
        .catch((error) => {
            console.error("Error loading movies:", error);
            res.status(500).send("Error loading movies.");
        });
}

function apiUpcomingMovies(req, res) {
    const page = getPageFromReq(req);
    const query = getQueryFromReq(req);
    getMovieListsByType("upcoming", page, 8, query)
        .then((movies) => res.json(movies))
        .catch((error) => {
            console.error("Error loading movies:", error);
            res.status(500).send("Error loading movies.");
        });
}

module.exports = {apiAllMovies, apiShowingMovies, apiUpcomingMovies};