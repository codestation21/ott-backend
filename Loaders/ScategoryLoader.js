const {Scategory} = require('../Model/sportsCategory');

module.exports.batchScategory = async (sCategoryIds) => {
    const scatgeories = await Scategory.find({_id: {$in: sCategoryIds}});
    return sCategoryIds.map(scategoryId => scatgeories.find(scategory => scategory.id === scategoryId));
}