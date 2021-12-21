const {Genre} = require('../Model/genreModel');

module.exports.batchGenre = async (genreIds) => {
    const genres = await Genre.find({_id: {$in: genreIds}});
    return genreIds.map(genreId => genres.find(genre => genre.id === genreId));
}