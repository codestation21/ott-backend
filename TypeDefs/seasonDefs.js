const {gql} = require('apollo-server-express');

module.exports = gql`
    extend type Query {
        getSeasonList: [Seasons]
        getSeasonById(id: ID): Seasons
    }
    extend type Mutation {
        addSeason(seasonThumb: Upload!, input: seasonInput): seasonInfoMessage
        updateSeason(seasonThumb: Upload, id: ID!, input: seasonInput): seasonInfoMessage
        deleteSeason(id: ID!): deleteSeasonInfo
    }
    input seasonInput {
        shows: String!
        seasonTitle: String!
        status: Boolean
        seoTitle: String
        metaDescription: String
        keyword: String
    }
    type Seasons {
        id: String!
        shows: Shows
        episode: [Episodes]
        seasonTitle: String
        seasonThumb: String
        status: Boolean
        seoTitle: String
        metaDescription: String
        keyword: String
        createdAt: Date
        updatedAt: Date
    }
    type deleteSeasonInfo {
        message: String,
        seasonTitle: String!
    }
    type seasonInfoMessage {
        message: String!
        id: String!
        seasonTitle: String!
        status: Boolean!
    }
`;