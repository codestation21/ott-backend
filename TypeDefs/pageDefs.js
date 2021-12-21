const {gql} = require('apollo-server-express');

module.exports = gql`
    extend type Query {
        getPageList: [Pages]
        getPageById(id: ID!): Pages
    }
    extend type Mutation {
        addPage(input: pageInput): pageInfoMessage
        updatePage(input: pageInput, id: ID!): pageInfoMessage
        deletePage(id: ID!): deletePageInfo
    }
    input pageInput {
        pageTitle: String
        description: String
        status: Boolean
    }
    type Pages {
        id: String
        pageTitle: String
        description: String
        status: Boolean
        createdAt: Date
        updatedAt: Date
    }
    type deletePageInfo {
        message: String
        pageTitle: String
    }
    type pageInfoMessage {
        message: String
        id: String
        pageTitle: String
        status: Boolean
    }
`;