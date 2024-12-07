// controller.js
const {promotions, MovieService} = require("./service");
const renderMovieList = async (req, res) => {
    try {

        const showingMovieList = (await MovieService.getMovieListsByType("showing", undefined, Infinity)).movies;
        const upcomingMovieList = (await MovieService.getMovieListsByType("upcoming", undefined, Infinity)).movies;
        res.render("home", {
            layout: "main",
            showingMovies: showingMovieList,
            upcomingMovies: upcomingMovieList,
            promotions,
        });
    } catch (error) {
        console.error("Error loading movies:", error);
        res.status(500).send("Error loading movies.");
    }
};

module.exports = {renderMovieList};
