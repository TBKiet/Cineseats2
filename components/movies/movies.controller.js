const MovieService = require("./movies.service");
const {getPageFromReq, getQueryFromReq} = require("../../utility/extractRequest");

const renderMovieListByType = async (req, res, movieType) => {
    try {
        const page = getPageFromReq(req);
        const query = getQueryFromReq(req);
        const movieData = await MovieService.getMovieListsByType(movieType, page, undefined, query);
        res.render("movie-list", {
            layout: "main", ...movieData
        });
    } catch (error) {
        console.error("Error loading movies:", error);
        res.status(500).send("Error loading movies.");
    }
};

exports.renderMovieList = async (req, res) =>
    renderMovieListByType(req, res, "all");

exports.renderShowingMovieList = async (req, res) =>
    renderMovieListByType(req, res, "showing");

exports.renderUpcomingMovieList = async (req, res) =>
    renderMovieListByType(req, res, "upcoming");

exports.renderMoviePage = async (req, res) => {
    try {
        const movieId = req.params.id;
        const movie = await MovieService.getMovieById(movieId);
        if (!movie) {
            return res
                .status(404)
                .render("404", {layout: "main", message: "Movie not found"});
        }
        res.render("movie-details", {layout: "main", ...movie});
    } catch (error) {
        console.error("Error fetching movie:", error);
        res.status(500).send("Internal server error");
    }
};