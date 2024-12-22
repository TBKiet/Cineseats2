const Showtime = require('./showtime_model/Showtime');
const TheaterRoom = require('./showtime_model/TheaterRoom');
const Theater = require('./showtime_model/Theater');
const { getCachedData } = require('../../config/redisConnection');

async function getShowtimes(movieId, date, city) {
    try {
        console.time('Redis'); // Start timing
        const uniqueDatesCacheKey = `uniqueDates:all`; // Adjust if uniqueDates is context-specific
        const uniqueCityCacheKey = `uniqueCity:all`; // Adjust if uniqueCity is context-specific

        // Fetch uniqueDates with caching
        const uniqueDates = await getCachedData(uniqueDatesCacheKey, () =>
            Showtime.findAll({
                attributes: ['date', 'dayOfWeek'],
                where: { movieId },
                group: ['date'],
                order: [['date', 'ASC']],
                raw: true, // Fetch plain objects to reduce overhead
            })
        );

        // Fetch uniqueCity with caching
        const uniqueCity = await getCachedData(uniqueCityCacheKey, () =>
            Theater.findAll({
                attributes: ['city'],
                group: ['city'],
                order: [['city', 'ASC']],
                raw: true,
            })
        );
        console.timeEnd('Redis'); // Logs the time taken
        console.time('MySQL'); // Start timing
        const showtimes = await Showtime.findAll({
            attributes: ['showtimeId', 'movieId', 'theaterRoomId', 'date', 'startTime'],
            where: {
                ...(movieId ? { movieId } : {}),
                ...(date ? { date } : {}),
            },
            include: [
                {
                    model: TheaterRoom,
                    attributes: ['roomId', 'roomName', 'totalSeats'],
                    include: [
                        {
                            model: Theater,
                            attributes: ['theaterId', 'theaterName', 'Location', 'theaterCity']
                        }
                    ]
                }
            ],
            order: [['startTime', 'ASC']]
        });
        console.timeEnd('MySQL'); // Logs the time taken
        console.time('theaterMap'); // Start timing
        // Build {theaters: []} structure
        const theaterMap = {};
        for (const showtime of showtimes) {
            const { showtimeId, startTime } = showtime;
            const { roomId, roomName, totalSeats, Theater: theater } = showtime.TheaterRoom;
            const { theaterId, theaterName, Location, theaterCity } = theater.dataValues;
            // If theater not mapped yet, create entry
            // console.log(city + " " + theaterCity);
            if (city && theaterCity != city) {
                continue;
            }
            if (!theaterMap[theaterId]) {
                theaterMap[theaterId] = {
                    theaterId,
                    theaterName,
                    address: `${Location}, ${theaterCity}`,
                    showtimes: []
                };
            }

            // Append new showtime
            theaterMap[theaterId].showtimes.push({
                showtimeId,
                startTime: startTime.slice(0, 5), // Extract only HH:MM
                theaterRoom: {
                    roomId,
                    roomName,
                    totalSeats
                }
            });
        }
        console.timeEnd('theaterMap'); // Logs the time taken
        return {
            theaters: Object.values(theaterMap),
            uniqueDates: uniqueDates,
            uniqueCity: uniqueCity
        };
    } catch (error) {
        console.error('Error fetching showtimes:', error);
        throw error;
    }
}
module.exports = { getShowtimes };
