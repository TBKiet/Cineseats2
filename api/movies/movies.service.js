const Movie = require("./movies.model");

async function getMovieListsByType(movieType, queryParam, page = 1, limit = 8) {
    try {
        const today = new Date();
        let filter = {};
        const movieStates = { all: "inactive-film", showing: "inactive-film", upcoming: "inactive-film" };

        if (movieType === "/showing") {
            filter = { release_date: { $lte: today }, end_date: { $gte: today } };
            movieStates.showing = "active-film";
        } else if (movieType === "/upcoming") {
            filter = { release_date: { $gt: today } };
            movieStates.upcoming = "active-film";
        } else {
            movieStates.all = "active-film";
        }

        const query = {};
        // Build the query object based on queryParam
        if (queryParam.name_vn) query.name_vn = { $regex: queryParam.name_vn, $options: "i" };
        if (queryParam.type_name_vn) query.type_name_vn = queryParam.type_name_vn;
        if (queryParam.limitage_vn) query.limitage_vn = queryParam.limitage_vn;
        if (queryParam.country_name_vn) query.country_name_vn = queryParam.country_name_vn;
        const movies = await Movie.find({ ...filter, ...query }).skip((page - 1) * limit).limit(limit).lean();
        const totalMovies = await Movie.countDocuments({ ...filter, ...query });
        const totalPages = Math.ceil(totalMovies / limit);

        const result = await Movie.aggregate([
            // Unwind the array field
            { $unwind: "$type_name_vn" },
            {
                $group: {
                    _id: null, // Group all documents
                    distinctGenres: { $addToSet: "$type_name_vn" }, // Collect unique values from the array
                    distinctCountries: { $addToSet: "$country_name_vn" }, // Collect unique strings
                    distinctAges: { $addToSet: "$limitage_vn" } // Collect unique strings
                }
            },
            { $project: { _id: 0 } } // Remove the _id field from the result
        ]);

        // Sort the distinct values
        result[0].distinctGenres.sort();
        result[0].distinctCountries.sort();
        result[0].distinctAges.sort();


        // console.log(result);
        return {
            movies,
            genres: result[0].distinctGenres,
            ages: result[0].distinctAges,
            countries: result[0].distinctCountries,
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
