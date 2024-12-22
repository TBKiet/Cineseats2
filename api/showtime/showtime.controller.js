const { getShowtimes } = require('./showtime.service');

exports.getShowtimesJson = async (req, res, next) => {
    const { movieId, date, city } = req.query;
    if (!movieId) {
        return res.status(400).json({ success: false, message: 'movieId is required' });
    }
    try {
        const showtimeData = await getShowtimes(movieId, date, city);
        res.json({ success: true, data: showtimeData });
    } catch (error) {
        next(error); // Forward to centralized error handler
    }
};
