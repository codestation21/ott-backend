const {combineResolvers} = require('graphql-resolvers');

const {Genre, validate} = require('../Model/genreModel');
const {Movie} = require('../Model/movieModel');
const {Show} = require('../Model/showsModel');
const {isAuthenticated} = require('../Middlewares/Authorize');
const {isAdmin} = require('../Middlewares/Admin');
const {isSubscriber} = require('../Middlewares/Subscriber');

module.exports = {
    Query: {
        getGenre: combineResolvers(isAuthenticated, async () => {
            const genre = await Genre.find();
            if (genre.length === 0) throw new Error("Genre not found!");
            return genre;
        }),
        getGenreById: combineResolvers(isAuthenticated, isSubscriber, async (_, {id}) => {
            const genre = await Genre.findOne({
                _id: id
            })
            if (!genre) throw new Error("Genre not found");
            return genre
        })
    },
    Mutation: {
        createGenre: combineResolvers(isAuthenticated, isAdmin, async (_, {input}) => {
            let genre = await Genre.findOne({
                name: input.name
            });
            if (genre) throw new Error("Genre already exist!");
            const {error} = validate(input);
            if (error) throw new Error(error.details[0].message);
            genre = new Genre({...input});
            const result = await genre.save();
            return {
                message: "Genre Created Successful!",
                name: result.name
            }
        }),
        updateGenre: combineResolvers(isAuthenticated, isAdmin, async (_, {input}) => {
            const genre = await Genre.findOne({
                _id: input.id
            });
            if (!genre) throw new Error("Genre not found!");
            genre.name = input.name;
            const result = await genre.save();
            return {
                message: "Genre updated successfully!",
                name: result.name
            }
        }),
        deleteGenre: combineResolvers(isAuthenticated, isAdmin, async (_, {id}) => {
            const result = await Genre.findByIdAndDelete(id);
            if (!result) throw new Error("Genre can't find!");
            return {
                message: "Genre Deleted successfully!"
            }
        })
    },
    Genre: {
        movies: async (parent) => {
            console.log(parent);
            const movie = await Movie.find({
                _id: parent.movies
            });
            return movie;
        },
        show: async (parent) => {
            const movie = await Movie.find({
                _id: parent.shows
            });
            return movie;
        }
    }
}