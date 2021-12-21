const {combineResolvers} = require('graphql-resolvers');

const {Scategory, validate} = require('../Model/sportsCategory');
const {Sports} = require('../Model/sports');
const {isAuthenticated} = require('../Middlewares/Authorize');
const {isAdmin} = require('../Middlewares/Admin');
const {isSubscriber} = require('../Middlewares/Subscriber');


module.exports = {
    Query: {
        getScategoryList: combineResolvers(isAuthenticated, async () => {
            const scategory = await Scategory.find();
            if (scategory.length === 0) throw new Error("Sport Category is empty!");
            return scategory;
        }),
        getScatgoryById: combineResolvers(isAuthenticated, isSubscriber, async (_, {id}) => {
            const scategory = await Scategory.findOne({
                _id: id
            });
            if (!scategory) throw new Error("Sport Catgory not found!");
            return scategory;
        })
    },
    Mutation: {
        addScategry: combineResolvers(isAuthenticated, isAdmin, async (_, {input}) => {
            const {error} = validate(input);
            if (error) throw new Error(error.details[0].message);
            const scategory = new Scategory({...input});
            const result = await scategory.save();
            return {
                message: "Sport Category Created Successfully!",
                id: result._id,
                sportCategory: result.sportCategory
            }
        }),
        updateScategory: combineResolvers(isAuthenticated, isAdmin, async (_, {input, id}) => {
            const scategory = await Scategory.findByIdAndUpdate(id, {...input}, {new: true});
            if (!scategory) throw new Error("Sport Category not found");
            return {
                message: "Sport Category updated Successfully!",
                id: scategory._id,
                sportCategory: scategory.sportCategory
            }
        }),
        deleteScategory: combineResolvers(isAuthenticated, isAdmin, async (_, {id}) => {
            const scategory = await Scategory.findByIdAndDelete(id);
            if (!scategory) throw new Error("Sport Category not found!");
            return {
                message: "Sport Category deleted successfully!",
                sportCategory: scategory.sportCategory
            }
        })
    },
    Scategoris: {
        sports: async (parent) => {
            const sport = await Sports.find({
                _id: parent.sports
            });
            return sport;
        }
    }
}