const { getFSMovieLists } = require("./search.service");
const renderMovieListByType = async (req, res, movieType) => {
  try {
    queryParam = {
      name_vn: req.query.keyword,
      type_name_vn: req.query.genre,
      limitage_vn: req.query.age,
      country_name_vn: req.query.country,
    }
    const filteredMovies = await getFSMovieLists(movieType, queryParam);
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
  await renderMovieListByType(req, res, "all");
};
exports.renderShowingMovieList = async (req, res) => {
  await renderMovieListByType(req, res, "showing");
};
exports.renderUpcomingMovieList = async (req, res) => {
  await renderMovieListByType(req, res, "upcoming");
};
