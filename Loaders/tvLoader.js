const {Tv} = require('../Model/tvModel');

module.exports.batchTv = async (tvIds) => {
    const tvs = await Tv.find({_id: {$in: tvIds}});
    return tvIds.map(tvId => tvs.find(tv => tv.id === tvId));
}