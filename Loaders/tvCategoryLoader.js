const {Tvcategory} = require('../Model/tvCategory');

module.exports.batchTvcategory = async (tvCategoryIds) => {
    const tvcategories = await Tvcategory.find({_id: {$in: tvCategoryIds}});
    return tvCategoryIds.map(tvCategoryId => tvcategories.find(tvcategory => tvcategory.id === tvCategoryId));
}