const {gql} = require('apollo-server-express');

module.exports = gql`
    extend type Query {
        getGenre: [Genre]
        getGenreById(id: ID!): Genre
    }
    extend type Mutation {
        createGenre(input: genreInput): createGenreInfo
        updateGenre(input: updateGenreInput): createGenreInfo
        deleteGenre(id: ID!): DeleteGenreInfo
    }
    input genreInput {
        name: String!
    }
    input updateGenreInput {
        id: String
        name: String
    }
    type GenreInfo {
        id: ID!
    }
    type createGenreInfo {
        message: String!
        name: String!
    }
    type DeleteGenreInfo{
        message: String!
    }
    type MovieGenre {
        id: String
        name: String
        createdAt: String
        updatedAt: String
    }
    type Genre {
        id: String!
        name: String!
        createdAt: String!
        updatedAt: String!
        movies: [MoviesInfo]
        show: [ShowsInfo]
    }
`;