const {gql} = require('apollo-server-express');

module.exports = gql`
    extend type Query {
        getSliderList: [Sliders]
        getSliderById(id: ID!): Sliders
    }
    extend type Mutation {
        addSlider(sliderImage: Upload!, input: slideInput): sliderInfoMessage
        updateSlider(sliderImage: Upload, id: ID!, input: slideInput): sliderInfoMessage
        deleteSlider(id: ID!): sliderDeleteInfo
    }
    input slideInput {
        sliderTitle: String
        postType: String
        postInfo: String
    }
    type sliderGenre {
        id: String!
        name: String!
    }
    type sliderPost {
        id: String,
        access: String,
        title: String
        postType: String
        genres: sliderGenre
        status: String
        imdbRating: String
        releaseDate: String
        duration: String
    }
    type Sliders {
        id: String
        sliderTitle: String
        sliderThumb: String
        posts: sliderPost
        createdAt: String
        updatedAt: String
    }
    type sliderDeleteInfo {
        message: String
        sliderTitle: String
    }
    type sliderInfoMessage {
        message: String
        id: String
        sliderTitle: String
    }
`;