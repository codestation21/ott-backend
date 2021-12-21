const {gql} = require('apollo-server-express');

module.exports = gql`
    extend type Query {
        getScategoryList: [Scategoris]
        getScatgoryById(id: ID!): Scategoris
    }
    extend type Mutation {
        addScategry(input: addScategoryInput): ScategoryInfoMessage
        updateScategory(id: ID!, input: addScategoryInput): ScategoryInfoMessage
        deleteScategory(id: ID!): deleteScategorInfo
    }
    input addScategoryInput {
        sportCategory: String!
    }
    type Scategoris {
        id: String
        sportCategory: String
        sports: [Sports]
        createdAt: Date
        updatedAt: Date
    }
    type deleteScategorInfo {
        message: String
        sportCategory: String
    }
    type ScategoryInfoMessage {
        message: String
        id: String
        sportCategory: String
    }
`;