const {gql} = require('apollo-server-express');

module.exports = gql`
    extend type Query {
        getSportsList: [Sports]
        getSportsById(id: ID!): Sports
    },
    extend type Mutation {
        addSports(imageFile: Upload!, videoFile: Upload, input: SportsInput): sportsInfoMessage
        updateSports(imageFile: Upload, videoFile: Upload, id: ID!, input: SportsInput): sportsInfoMessage
        deleteSports(id: ID!): deleteSportsInfo
    }
    input SportsInput {
        access: String
        sportCategory: String
        sportsTitle: String
        description: String
        releaseDate: String
        duration: String
        status: Boolean
        seoTitle: String
        metaDescription: String
        keyword: String
        urlVideo: String
        embedCode: String
        hlsVideo: String
        mpegVideo: String
        downloadUrl: String
        subtitle: String
    }
    type Sports {
        id: String
        access: String
        sportCategory: Scategoris
        sportsTitle: String
        description: String
        releaseDate: String
        duration: String
        status: Boolean
        seoTitle: String
        metaDescription: String
        keyword: String
        sportsThumb: String
        localVideo: String
        urlVideo: String
        embedCode: String
        hlsVideo: String
        mpegVideo: String
        downloadUrl: String
        subtitle: String
        createdAt: Date
        updatedAt: Date
    }
    type deleteSportsInfo {
        message: String
        sportsTitle: String
    }
    type sportsInfoMessage {
        message: String
        id: String
        sportsTitle: String
        status: String
    }
`;