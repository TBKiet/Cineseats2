const Movie = require("./movies.model");

async function getMovieListsByType(movieType, page = 1, limit = 8) {
    const today = new Date();
    let filter = {};
    const movieStates = { all: "inactive-film", showing: "inactive-film", upcoming: "inactive-film" };

    if (movieType === "showing") {
        filter = { release_date: { $lte: today }, end_date: { $gte: today } };
        movieStates.showing = "active-film";
    } else if (movieType === "upcoming") {
        filter = { release_date: { $gt: today } };
        movieStates.upcoming = "active-film";
    } else {
        movieStates.all = "active-film";
    }

    try {
        const movies = await Movie.find(filter)
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();
        const totalMovies = await Movie.countDocuments(filter);
        const totalPages = Math.ceil(totalMovies / limit);

        const extractUnique = (key) => [...new Set(movies.flatMap((movie) => movie[key]))].sort();
        return {
            movies,
            genres: extractUnique("type_name_vn"),
            ages: extractUnique("limitage_vn"),
            ratings: extractUnique("ratings"),
            countries: extractUnique("country_name_vn"),
            totalPages,
            currentPage: page,
            ...movieStates, // Ensure movieStates are included in the returned object
        };
    } catch (err) {
        console.error("Error fetching movies:", err);
        return { movies: [], genres: [], ages: [], ratings: [], countries: [], totalPages: 0, currentPage: page, ...movieStates };
    }
}

async function getRelatedMovies(movieData) {
    try {
        const regexGenres = new RegExp(movieData.type_name_vn.join("|"), "i");
        const relatedMovies = await Movie.find({
            type_name_vn: { $regex: regexGenres },
            id: { $ne: movieData.id },
        }).lean();

        return relatedMovies;
    } catch (err) {
        console.error("Error fetching related movies:", err);
        return [];
    }
}

async function getMovieById(movieId) {
    const movie = await Movie.findOne({ id: movieId }).lean();
    if (!movie) return null;

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

    const relatedMovies = await getRelatedMovies(movie);

    return {
        ...movie,
        release_date: formatDate(movie.release_date),
        end_date: formatDate(movie.end_date),
        relatedMovies,
    };
}

module.exports = { getMovieListsByType, getMovieById };
