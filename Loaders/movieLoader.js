const {Movie} = require('../Model/movieModel');

module.exports.batchMovie = async (movieIds) => {
    const movies = await Movie.find({_id: {$in: movieIds}});
    return movieIds.map(movieId => movies.find(movie => movie.id === movieId));
}