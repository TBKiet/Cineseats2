const Showtime =require('./showtime.model');
async function getShowtimes() {
    try {
        const showtimes = await Showtime.findAll();
        return showtimes;
    } catch (error) {
        throw new Error('Error fetching showtimes: ' + error.message);
    }
}
module.exports = { getShowtimes };