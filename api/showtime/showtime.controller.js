const {getShowtimes} = require("./showtime.service");

exports.getShowtimesJson = async (req, res) => {
    try {
        const showtimeData = await getShowtimes();
        res.json(showtimeData);
    } catch (error) {
        console.error("Error loading showtimes:", error);
        res.status(500).send("Error loading showtimes.");
    }
}