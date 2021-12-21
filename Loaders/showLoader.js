const {Show} = require('../Model/showsModel');

module.exports.batchShow = async (showIds) => {
    const shows = await Show.find({_id: {$in: showIds}});
    return showIds.map(showId => shows.find(show => show.id === showId));
}