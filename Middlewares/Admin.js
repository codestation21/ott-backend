const {skip} = require('graphql-resolvers');

module.exports.isAdmin = (_, __, {requestedUserInfo}) => {
    if(requestedUserInfo.role !== "sub-admin" && requestedUserInfo.role !== "admin") throw new Error("Forbidden!");
    return skip;
}