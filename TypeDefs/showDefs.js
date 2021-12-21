const {gql} = require('apollo-server-express');

module.exports = gql`
    extend type Query {
        getShowList: [Shows!]
        getShowById(id: ID!): Shows
    }
    extend type Mutation {
        addShows(showThumb: Upload!, input: ShowInput): ShowInfoMessage
        updateShows(showThumb: Upload, id: ID!, input: ShowInput): ShowInfoMessage
        deleteShow(id: ID!): showDeleteInfo
    }
    input ShowInput {
        language: String!
        genres: String!
        showName: String!
        sortInfo: String
        imdbRating: String
        status: Boolean
        seoTitle: String
        metaDescription: String
        keyword: String
    }
    type Shows {
        id: String
        language: String
        genres: MovieGenre
        showName: String
        showThumb: String
        sortInfo: String
        imdbRating: String
        status: Boolean
        seoTitle: String
        metaDescription: String
        keyword: String
        createdAt: Date
        updatedAt: Date
        season: [Seasons]
    }
    type showDeleteInfo{
        message: String!,
        showName: String
    }
    type ShowInfoMessage{
        message: String!
        id: String!
        showName: String!
        status: Boolean!
    }
`;