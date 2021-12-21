const {Sports} = require('../Model/sports');

module.exports.batchSports = async (sportIds) => {
    const sports = await Sports.find({_id: {$in: sportIds}});
    return sportIds.map(sportId => sports.find(sport => sport.id === sportId));
}