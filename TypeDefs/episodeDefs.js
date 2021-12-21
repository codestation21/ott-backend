const {gql} = require('apollo-server-express');

module.exports = gql`
    extend type Query {
        getEpisodeList: [Episodes]
        getEpisodeById(id: ID!): Episodes
    }
    extend type Mutation {
        addEpisode(imageFile: Upload!, videoFile: Upload, input: episodeInput): episodeInfoMessage
        updateEpisode(imageFile: Upload, videoFile: Upload, id: ID!, input: episodeInput): episodeInfoMessage
        deleteEpisode(id: ID!): episodeDeleInfo
    }
    input episodeInput {
        access: String
        seasons: String
        episodeTitle: String
        description: String
        imdbRating: String
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
    type Episodes {
        id: String
        access: String
        seasons: Seasons
        episodeTitle: String
        description: String
        imdbRating: String
        releaseDate: String
        duration: String
        status: Boolean
        seoTitle: String
        metaDescription: String
        keyword: String
        episodeThumb: String
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
    type episodeDeleInfo {
        message: String
        episodeTitle: String
    }
    type episodeInfoMessage {
        message: String
        id: String
        episodeTitle: String
        status: Boolean

    }
`;