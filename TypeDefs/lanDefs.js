const {gql} = require('apollo-server-express');

module.exports = gql`
    extend type Query {
        getLanguage: [Languages]
    }
    extend type Mutation {
        addLanguage(lanThumb: Upload!, input: lanInput): lanInfoMessage
        updateLanguage(lanThumb: Upload, id: ID!, input: lanInput): lanInfoMessage
        deleteLanguage(id: ID!): lanDeleteMessage
    }
    input lanInput {
        language: String
        status: Boolean
    }
    type Languages {
        id: String
        language: String
        lanThumb: String
        status: String
        createdAt: Date
        updatedAt: Date
    }
    type lanDeleteMessage {
        message: String
    }
    type lanInfoMessage {
        message: String
        id: String
        language: String
    }
`;