const MovieService = require("./search.service");
const {getQueryFromReq, getPageFromReq} = require("../../utility/extractRequest");

const renderFilteredMovieListByType = async (req, res, movieType) => {
    try {
        const query = getQueryFromReq(req);
        const page = getPageFromReq(req);
        const filteredMovies = await MovieService.getMovieListsByType(movieType, page, undefined, query);
        res.render("movie-list", {
            layout: "main",
            ...filteredMovies,
        });
    } catch (error) {
        console.error("Error loading movies:", error);
        res.status(500).send("Error loading movies.");
    }
};
exports.renderMovieList = async (req, res) => {
    await renderFilteredMovieListByType(req, res, "all");
};
exports.renderShowingMovieList = async (req, res) => {
    await renderFilteredMovieListByType(req, res, "showing");
};
exports.renderUpcomingMovieList = async (req, res) => {
    await renderFilteredMovieListByType(req, res, "upcoming");
};
