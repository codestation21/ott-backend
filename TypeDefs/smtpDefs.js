const {gql} = require('apollo-server-express');

module.exports = gql`
    extend type Query {
        getSmtp: Smtps
    }
    extend type Mutation {
        updateSmtp(input: smtpInput): smtpInfoMessage
    }
    input smtpInput {
        host: String
        port: String
        email: String
        password: String
    }
    type Smtps {
        id: String
        host: String
        port: String
        email: String
        password: String
        createdAt: String
        updatedAt: String
    }
    type smtpInfoMessage {
        message: String
    }
`;