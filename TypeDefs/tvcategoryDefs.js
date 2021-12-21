const {gql} = require('apollo-server-express');

module.exports = gql`
    extend type Query {
        getTvCategoryList: [tvCategoris]
        getTvCategoryById(id: ID!): tvCategoris
    }
    extend type Mutation {
        addTvcategory(input: tvcategoryInput): tvcategoryInfoMessage
        updateTvcategory(id: ID!, input: tvcategoryInput): tvcategoryInfoMessage
        deteletTvcategory(id: ID!): tvCategoryDeleteInfo
    }
    input tvcategoryInput {
        tvCategory: String
    }
    type tvCategoris {
        id: String
        tvCategory: String
        tvs: [Tvs]
        createdAt: Date
        updatedAt: Date
    }
    type tvCategoryDeleteInfo {
        message: String
        tvCategory: String
    }
    type tvcategoryInfoMessage {
        message: String
        id: String
        tvCategory: String
    }
`;