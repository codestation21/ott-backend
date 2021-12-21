const {Season} = require('../Model/seasonModel');

module.exports.batchSeason = async (seasonIds) => {
    const seasons = await Season.find({_id: {$in: seasonIds}});
    return seasonIds.map(seasonId => seasons.find(season => season.id === seasonId));
}