const {gql} = require('apollo-server-express');

module.exports = gql`
    extend type Query {
        getMovieList: [Movies]
        getMoviesById(id: ID!): Movies
    }
    extend type Mutation {
        addMovies(imageUpFile: Upload!, videoUpFile: Upload, input: movieInput): addMoviesInfo
        updateMovies(imageUpFile: Upload, videoUpFile: Upload,id: ID, input: movieInput): addMoviesInfo
        deleteMovies(id: ID!): movieDeleteInfo
    }
    input movieInput {
        movieAccess: String
        language: String
        genres: String
        movieName: String
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
    type Movies {
        id: String
        movieAccess: String
        language: String
        genres: MovieGenre
        movieName: String
        description: String
        imdbRating: String
        releaseDate: String
        duration: String
        status: Boolean
        seoTitle: String
        metaDescription: String
        keyword: String
        movieThumbnail: String
        localVideo: String
        urlVideo: String
        embedCode: String
        hlsVideo: String
        mpegVideo: String
        downloadUrl: String
        subtitle: String
        createdAt: String
        updatedAt: String
    }
    type movieDeleteInfo {
        message: String
        movieName: String
    }
    type addMoviesInfo {
        message: String!
        movieName: String
        description: String
        releaseDate: String
        imdbRating: String
    }
    type MoviesInfo {
        id: String
        movieName: String
        description: String
        duration: String
        releaseDate: String
        imdbRating: String
        movieThumbnail: String
    },
    type ShowsInfo {
        id: String
        showName: String
        showThumb: String
        sortInfo: String
    }
`;