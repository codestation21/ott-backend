const {combineResolvers} = require('graphql-resolvers');

const {Tvcategory, validate} = require('../Model/tvCategory');
const {Tv} = require('../Model/tvModel');
const {isAuthenticated} = require('../Middlewares/Authorize');
const {isAdmin} = require('../Middlewares/Admin');
const {isSubscriber} = require('../Middlewares/Subscriber');


module.exports = {
    Query: {
        getTvCategoryList: combineResolvers(isAuthenticated, async () => {
            const tvcategory = await Tvcategory.find();
            if (tvcategory.length === 0) throw new Error("Tv category list is empty");
            return tvcategory;
        }),
        getTvCategoryById: combineResolvers(isAuthenticated, isSubscriber, async (_, {id}) => {
            const tvcategory = await Tvcategory.findOne({
                _id: id
            });
            if (!tvcategory) throw new Error("Tv cateory not found!");
            return tvcategory;
        })
    },
    Mutation: {
        addTvcategory: combineResolvers(isAuthenticated, isAdmin, async (_, {input}) => {
            const {error} = validate(input);
            if (error) throw new Error(error.details[0].message);
            const tvcategory = new Tvcategory({...input});
            const result = await tvcategory.save();
            console.log(result);
            return {
                message: "Tv Category added successfully!",
                id: result._id,
                tvCategory: result.tvCategory
            }
        }),
        updateTvcategory: combineResolvers(isAuthenticated, isAdmin, async (_, {id, input}) => {
            const tvcategory = await Tvcategory.findByIdAndUpdate(id, {...input}, {new: true});
            if (!tvcategory) throw new Error("Tv Category not found!");
            return {
                message: "Tv Category updated successfully!",
                id: tvcategory._id,
                tvCategory: tvcategory.tvCategory
            }

        }),
        deteletTvcategory: combineResolvers(isAuthenticated, isAdmin, async (_, {id}) => {
            const tvcategory = await Tvcategory.findByIdAndDelete(id);
            if (!tvcategory) throw new Error("Tv category not found!");
            return {
                message: "Tv Category deleted successfully!",
                tvCategory: tvcategory.tvCategory
            }
        })
    },
    tvCategoris: {
        tvs: async (parent) => {
            const tv = await Tv.find({
                _id: parent.tv
            });
            return tv;
        }
    }
}