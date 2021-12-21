const { combineResolvers } = require('graphql-resolvers');
const { parse, join } = require("path");
const { createWriteStream } = require("fs");
const fs = require("fs");

const { Movie, validate } = require('../Model/movieModel');
const { Genre } = require('../Model/genreModel');
const { isAuthenticated } = require('../Middlewares/Authorize');
const { isAdmin } = require('../Middlewares/Admin');
const { generate } = require("otp-generator");
const { isSubscriber } = require('../Middlewares/Subscriber')


module.exports = {
    Query: {
        getMovieList: combineResolvers(isAuthenticated, async () => {
            const movie = await Movie.find();
            if (movie.length === 0) throw new Error("Movie not found!");
            return movie;
        }),
        getMoviesById: combineResolvers(isAuthenticated, isSubscriber, async (_, { id }) => {
            const movie = await Movie.findOne({
                _id: id
            });
            if (!movie) throw new Error("Movie not Found!");
            return movie;
        })
    },
    Mutation: {
        addMovies: combineResolvers(isAuthenticated, isAdmin, async (_, { imageUpFile, videoUpFile, input }) => {
            const { error } = validate(input);
            if (error) throw new Error(error.details[0].message)
            var { filename, createReadStream } = await imageUpFile;
            var stream = createReadStream();
            var { ext, name } = parse(filename);
            name = `suparott${Math.floor((Math.random() * 10000) + 1)}`;
            let imageFile = join(__dirname, `../Upload/Image/${name}-${Date.now()}${ext}`);
            const iamageStrem = await createWriteStream(imageFile)
            await stream.pipe(iamageStrem);
            const baseUrl = process.env.BASE_URL
            const port = process.env.PORT
            imageFile = `${baseUrl}${port}${imageFile.split('Upload')[1]}`
            if (videoUpFile) {
                var { filename, createReadStream } = await videoUpFile;
                var stream = createReadStream();
                var { ext, name } = parse(filename);
                name = `suparott${Math.floor((Math.random() * 10000) + 1)}`;
                let videoFile = join(__dirname, `../Upload/Video/${name}-${Date.now()}${ext}`);
                const videoStream = await createWriteStream(videoFile)
                await stream.pipe(videoStream);
                videoFile = `${baseUrl}${port}${videoFile.split('Upload')[1]}`
                const movie = new Movie({ ...input, movieThumbnail: imageFile, localVideo: videoFile });
                const result = await movie.save();
                const genre = await Genre.findOne({
                    _id: input.genres
                });
                genre.movies.push(result.id);
                await genre.save();
                return {
                    message: "Movie add successfully!",
                    movieName: result.movieName,
                    description: result.description,
                    releaseDate: result.releaseDate,
                    imdbRating: result.imdbRating
                }
            } else {
                const movie = new Movie({ ...input, movieThumbnail: imageFile });
                const result = await movie.save();
                const genre = await Genre.findOne({
                    _id: input.genres
                });
                genre.movies.push(result.id);
                await genre.save();
                return {
                    message: "Movie add successfully!",
                    movieName: result.movieName,
                    description: result.description,
                    releaseDate: result.releaseDate,
                    imdbRating: result.imdbRating
                }
            }
        }),
        updateMovies: combineResolvers(isAuthenticated, isAdmin, async (_, { imageUpFile, videoUpFile, id, input }) => {
            const movie = await Movie.findOne({
                _id: id
            });
            if (!movie) throw new Error("Movie can not found!");
            const imageFileUp = await imageUpFile
            const videoFileUp = await videoUpFile
            if (imageFileUp && movie.movieThumbnail) {
                const deleteAvatar = movie.movieThumbnail.split('Image')[1].replace(/\\/g, "");
                fs.unlinkSync(join(__dirname, `../Upload/Image/${deleteAvatar}`));
            }
            if (videoFileUp && movie.localVideo) {
                const deleteAvatar = movie.localVideo.split('Video')[1].replace(/\\/g, "");
                fs.unlinkSync(join(__dirname, `../Upload/Video/${deleteAvatar}`));
            }
            const baseUrl = process.env.BASE_URL;
            const port = process.env.PORT;
            if (imageFileUp && !videoFileUp) {
                var { filename, createReadStream } = imageFileUp;
                var stream = createReadStream();
                var { ext, name } = parse(filename);
                name = `suparott${Math.floor((Math.random() * 10000) + 1)}`;
                let imageFile = join(__dirname, `../Upload/Image/${name}-${Date.now()}${ext}`);
                const iamageStrem = await createWriteStream(imageFile)
                await stream.pipe(iamageStrem);
                imageFile = `${baseUrl}${port}${imageFile.split('Upload')[1]}`
                if (input.genres) {
                    const oldGenres = await Genre.findOne({
                        _id: movie.genres
                    })
                    oldGenres.movies.pull(movie._id);
                    await oldGenres.save();
                    const newGenres = await Genre.findOne({
                        _id: input.genres
                    })
                    newGenres.movies.push(movie._id);
                    await newGenres.save();
                }
                const result = await Movie.findByIdAndUpdate(id, {
                    ...input,
                    movieThumbnail: imageFile
                }, { new: true });
                return {
                    message: "Movie Updated successfully!",
                    movieName: result.movieName,
                    description: result.description,
                    releaseDate: result.releaseDate,
                    imdbRating: result.imdbRating
                }

            } else if (!imageFileUp && videoFileUp) {
                var { filename, createReadStream } = videoFileUp;
                var stream = createReadStream();
                var { ext, name } = parse(filename);
                name = `suparott${Math.floor((Math.random() * 10000) + 1)}`;
                let videoFile = join(__dirname, `../Upload/Video/${name}-${Date.now()}${ext}`);
                const videoStream = await createWriteStream(videoFile)
                await stream.pipe(videoStream);
                videoFile = `${baseUrl}${port}${videoFile.split('Upload')[1]}`
                if (input.genres) {
                    const oldGenres = await Genre.findOne({
                        _id: movie.genres
                    })
                    oldGenres.movies.pull(movie._id);
                    await oldGenres.save();
                    const newGenres = await Genre.findOne({
                        _id: input.genres
                    })
                    newGenres.movies.push(movie._id);
                    await newGenres.save();
                }
                const result = await Movie.findByIdAndUpdate(id, {
                    ...input,
                    localVideo: videoFile
                }, { new: true });
                return {
                    message: "Movie Updated successfully!",
                    movieName: result.movieName,
                    description: result.description,
                    releaseDate: result.releaseDate,
                    imdbRating: result.imdbRating
                }
            } else if (imageFileUp && videoFileUp) {
                var { filename, createReadStream } = imageFileUp;
                var stream = createReadStream();
                var { ext, name } = parse(filename);
                name = `suparott${Math.floor((Math.random() * 10000) + 1)}`;
                let imageFile = join(__dirname, `../Upload/Image/${name}-${Date.now()}${ext}`);
                const iamageStrem = await createWriteStream(imageFile)
                await stream.pipe(iamageStrem);
                imageFile = `${baseUrl}${port}${imageFile.split('Upload')[1]}`
                var { filename, createReadStream } = videoFileUp;
                var stream = createReadStream();
                var { ext, name } = parse(filename);
                name = `suparott${Math.floor((Math.random() * 10000) + 1)}`;
                let videoFile = join(__dirname, `../Upload/Video/${name}-${Date.now()}${ext}`);
                const videoStream = await createWriteStream(videoFile)
                await stream.pipe(videoStream);
                videoFile = `${baseUrl}${port}${videoFile.split('Upload')[1]}`
                if (input.genres) {
                    const oldGenres = await Genre.findOne({
                        _id: movie.genres
                    })
                    oldGenres.movies.pull(movie._id);
                    await oldGenres.save();
                    const newGenres = await Genre.findOne({
                        _id: input.genres
                    })
                    newGenres.movies.push(movie._id);
                    await newGenres.save();
                }
                const result = await Movie.findByIdAndUpdate(id, {
                    ...input,
                    movieThumbnail: imageFile,
                    localVideo: videoFile
                }, { new: true });
                return {
                    message: "Movie Updated successfully!",
                    movieName: result.movieName,
                    description: result.description,
                    releaseDate: result.releaseDate,
                    imdbRating: result.imdbRating
                }
            } else {
                if (input.genres) {
                    const oldGenres = await Genre.findOne({
                        _id: movie.genres
                    })
                    oldGenres.movies.pull(movie._id);
                    await oldGenres.save();
                    const newGenres = await Genre.findOne({
                        _id: input.genres
                    })
                    newGenres.movies.push(movie._id);
                    await newGenres.save();
                }
                const result = await Movie.findByIdAndUpdate(id, {
                    ...input
                }, { new: true });
                return {
                    message: "Movie Updated successfully!",
                    movieName: result.movieName,
                    description: result.description,
                    releaseDate: result.releaseDate,
                    imdbRating: result.imdbRating
                }
            }
        }),
        deleteMovies: combineResolvers(isAuthenticated, isAdmin, async (_, { id }) => {
            const movie = await Movie.findByIdAndDelete(id)
            if (!movie) throw new Error("Movie not found!");
            if (movie.movieThumbnail) {
                const deleteAvatar = movie.movieThumbnail.split('Image')[1].replace(/\\/g, "");
                fs.unlinkSync(join(__dirname, `../Upload/Image/${deleteAvatar}`));
            }
            if (movie.localVideo) {
                const deleteAvatar = movie.localVideo.split('Video')[1].replace(/\\/g, "");
                fs.unlinkSync(join(__dirname, `../Upload/Video/${deleteAvatar}`));
            }
            const genres = await Genre.findOne({
                _id: movie.genres
            });
            genres.movies.pull(movie._id);
            return {
                message: "Movie Deleted Successfull!",
                movieName: movie.movieName
            }
        })
    },
    Movies: {
        genres: async (parent, _, { loaders }) => {
            const genre = await loaders.genres.load(parent.genres.toString());
            return genre;
        }
    }
}