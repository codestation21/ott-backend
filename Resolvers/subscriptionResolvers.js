const {combineResolvers} = require('graphql-resolvers');

const {Subscription, validate} = require('../Model/subscriptionModel');
const {isAuthenticated} = require('../Middlewares/Authorize');
const {isAdmin} = require('../Middlewares/Admin');

module.exports = {
    Query: {
        getSubscriptionList: combineResolvers(isAuthenticated, async () => {
            const subscription = await Subscription.find();
            if (subscription.length === 0) throw new Error("Subscription list is empty!");
            return subscription;
        }),
        getSubscriptionById: combineResolvers(isAuthenticated, async (_, {id}) => {
            const subscription = await Subscription.findOne({
                _id: id
            });
            if (!subscription) throw new Error("Subscription not found!");
            return subscription;
        })
    },
    Mutation: {
        addSubscription: combineResolvers(isAuthenticated, isAdmin, async (_, {input}) => {
            const {error} = validate(input);
            if (error) throw new Error(error.details[0].message);
            const subscription = new Subscription({...input});
            const result = await subscription.save();
            return {
                message: "Subscription Added successfully!",
                id: result._id,
                planName: result.planName,
                status: result.status,
            }
        }),
        updateSubscription: combineResolvers(isAuthenticated, isAdmin, async (_, {id, input}) => {
            const result = await Subscription.findByIdAndUpdate(id, {...input}, {new: true});
            if (!result) throw new Error("Subscription not found!");
            return {
                message: "Subscription updated successfully!",
                id: result._id,
                planName: result.planName,
                status: result.status
            }
        }),
        deleteSubscription: combineResolvers(isAuthenticated, isAdmin, async (_, {id}) => {
            const result = await Subscription.findByIdAndDelete(id);
            if (!result) throw new Error("Subscription plan not found!");
            return {
                message: "Subscription deleted successfully!",
                planName: result.planName,
            }
        })
    }
}