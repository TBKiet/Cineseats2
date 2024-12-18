exports.renderMovieList = async (req, res) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const apiMovieUrl = `${baseUrl}/api${req.originalUrl}`;
    try {
        const response = await fetch(apiMovieUrl);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const movieData = await response.json();
        res.render("movie-list", {
            layout: "main", ...movieData
        });
    } catch (error) {
        console.error("Error loading movies:", error);
        res.status(500).send("Error loading movies.");
    }
};

exports.renderMoviePage = async (req, res) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const apiMovieUrl = `${baseUrl}/api${req.originalUrl}`;
    try {
        const response = await fetch(apiMovieUrl);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const movieData = await response.json();
        res.render("movie-details", { layout: "main", ...movieData });
    } catch (error) {
        console.error("Error fetching movie:", error);
        res.status(500).send("Internal server error");
    }
};