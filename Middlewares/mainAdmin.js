const {skip} = require('graphql-resolvers');

module.exports.isMainAdmin = (_, __, {requestedUserInfo}) => {
    if(requestedUserInfo.role !== "admin") throw new Error("Forbidden!");
    return skip;
}