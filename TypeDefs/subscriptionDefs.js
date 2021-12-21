const {gql} = require('apollo-server-express');

module.exports = gql`
    extend type Query {
        getSubscriptionList: [Subscriptions]
        getSubscriptionById(id: ID!): Subscriptions
    }
    extend type Mutation {
        addSubscription(input: subscriptionInput): subInfoMessage
        updateSubscription(id: ID!, input: subscriptionInput): subInfoMessage
        deleteSubscription(id: ID!): subDeleteInfo
    }
    input subscriptionInput {
        planName: String
        duration: Int
        durationType: String
        price: Int
        status: Boolean
    }
    type subDeleteInfo {
        message: String
        planName: String
    }
    type Subscriptions {
        id: ID
        planName: String
        duration: Int
        durationType: String
        price: Int
        status: Boolean
        createdAt: Date
        updatedAt: Date
    }
    type subInfoMessage {
        message: String
        id: ID
        planName: String
        status: Boolean
    }
`;