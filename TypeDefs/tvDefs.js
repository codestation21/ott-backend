const {gql} = require('apollo-server-express');

module.exports = gql`
    extend type Query {
        getTvList: [Tvs]
        getTvById(id: ID!): Tvs
    }
    extend type Mutation {
        addTv(tvLogo: Upload!, input: tvInput): tvInfoMessage
        updateTv(tvLogo: Upload, id: ID!, input: tvInput): tvInfoMessage
        deleteTv(id: ID!): tvDeleteInfo
    }
    input tvInput{
        tvAccess: String
        tvCategory: String
        tvName: String
        description: String
        status: Boolean
        httpStreamUrlOne: String
        httpStreamUrlTwo: String
        httpStreamUrlThree: String
        mpegStreamUrlOne: String
        mpegStreamUrlTwo: String
        mpegStreamUrlThree: String
        tvEmbedCode: String
        youtubeUrl: String
        seoTitle: String
        metaDescription: String
        keyword: String
    }
    type Tvs {
        id: String
        tvAccess: String
        tvCategory: tvCategoris
        tvName: String
        tvLogo: String
        description: String
        status: Boolean
        httpStreamUrlOne: String
        httpStreamUrlTwo: String
        httpStreamUrlThree: String
        mpegStreamUrlOne: String
        mpegStreamUrlTwo: String
        mpegStreamUrlThree: String
        tvEmbedCode: String
        youtubeUrl: String
        seoTitle: String
        metaDescription: String
        keyword: String
        createdAt: Date
        updatedAt: Date
    }
    type tvDeleteInfo {
        message: String
        tvName: String
    }
    type tvInfoMessage {
        message: String
        id: String
        tvName: String
        status: Boolean
    }
`;