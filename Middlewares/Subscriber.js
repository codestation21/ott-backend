const {skip} = require('graphql-resolvers');

module.exports.isSubscriber = async (_, __, {requestedUserInfo}) => {
    if (requestedUserInfo.role === 'user' && !requestedUserInfo.isPaid) throw new Error("Please subscribe one plan!");
    return skip;
}