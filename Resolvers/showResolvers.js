const {combineResolvers} = require('graphql-resolvers');
const {parse, join} = require("path");
const {createWriteStream} = require("fs");
const fs = require("fs");

const {Genre} = require('../Model/genreModel');
const {Show, validate} = require('../Model/showsModel');
const {isAuthenticated} = require('../Middlewares/Authorize');
const {isAdmin} = require('../Middlewares/Admin');
const {Season} = require("../Model/seasonModel");
const {isSubscriber} = require('../Middlewares/Subscriber');


module.exports = {
    Query: {
        getShowList: combineResolvers(isAuthenticated, async () => {
            const show = await Show.find();
            if (show.length === 0) throw new Error("Show not found!");
            return show;
        }),
        getShowById: combineResolvers(isAuthenticated, isSubscriber, async (_, {id}) => {
            const show = await Show.findOne({
                _id: id
            });
            if (!show) throw new Error("Show not found");
            return show
        })
    },
    Mutation: {
        addShows: combineResolvers(isAuthenticated, isAdmin, async (_, {showThumb, input}) => {
            const {error} = validate(input);
            if (error) throw new Error(error.details[0].message);
            var {filename, createReadStream} = await showThumb;
            var stream = createReadStream();
            var {ext, name} = parse(filename);
            name = `suparott${Math.floor((Math.random() * 100000) + 1)}`;
            let imageFile = join(__dirname, `../Upload/Image/${name}-${Date.now()}${ext}`);
            const iamageStrem = await createWriteStream(imageFile)
            await stream.pipe(iamageStrem);
            const baseUrl = process.env.BASE_URL
            const port = process.env.PORT
            imageFile = `${baseUrl}${port}${imageFile.split('Upload')[1]}`;
            const show = new Show({...input, showThumb: imageFile});
            const result = await show.save();
            const genre = await Genre.findOne({
                _id: input.genres
            });
            genre.shows.push(result._id);
            await genre.save();
            return {
                message: "Add Shows successfully!",
                id: result._id,
                showName: result.showName,
                status: result.status
            }
        }),
        updateShows: combineResolvers(isAuthenticated, isAdmin, async (_, {showThumb, id, input}) => {
            const show = await Show.findOne({
                _id: id
            });
            if (!show) throw new Error("Show not found");
            const showThumbUp = await showThumb;
            if (showThumbUp && show.showThumb) {
                const deleteShowThumb = show.showThumb.split('Image')[1].replace(/\\/g, "");
                fs.unlinkSync(join(__dirname, `../Upload/Image/${deleteShowThumb}`));
            }
            if (showThumbUp) {
                let {filename, createReadStream} = showThumbUp;
                let stream = createReadStream();
                let {ext, name} = parse(filename);
                name = `suparott${Math.floor((Math.random() * 10000) + 1)}`;
                let imageFile = join(__dirname, `../Upload/Image/${name}-${Date.now()}${ext}`);
                let writeStream = await createWriteStream(imageFile);
                await stream.pipe(writeStream);
                const baseUrl = process.env.BASE_URL
                const port = process.env.PORT
                imageFile = `${baseUrl}${port}${imageFile.split('Upload')[1]}`;
                const result = await Show.findByIdAndUpdate(id, {...input, showThumb: imageFile}, {new: true});
                if (input.genres) {
                    const oldGenres = await Genre.findOne({
                        _id: show.genres
                    })
                    oldGenres.shows.pull(show._id);
                    await oldGenres.save();
                    const newGenres = await Genre.findOne({
                        _id: input.genres
                    })
                    newGenres.shows.push(show._id);
                    await newGenres.save();
                }
                return {
                    message: "Show updated Successfully!",
                    id: result._id,
                    showName: result.showName,
                    status: result.status
                }
            } else {
                const result = await Show.findByIdAndUpdate(id, {...input}, {new: true});
                if (input.genres) {
                    const oldGenres = await Genre.findOne({
                        _id: show.genres
                    })
                    oldGenres.shows.pull(show._id);
                    await oldGenres.save();
                    const newGenres = await Genre.findOne({
                        _id: input.genres
                    })
                    newGenres.shows.push(show._id);
                    await newGenres.save();
                }
                return {
                    message: "Show updated Successfully!",
                    id: result._id,
                    showName: result.showName,
                    status: result.status
                }
            }
        }),
        deleteShow: combineResolvers(isAuthenticated, isAdmin, async (_, {id}) => {
            const show = await Show.findByIdAndDelete(id);
            if (!show) throw new Error("Show not found!");
            if (show.showThumb) {
                const deleteShowThumb = show.showThumb.split('Image')[1].replace(/\\/g, "");
                fs.unlinkSync(join(__dirname, `../Upload/Image/${deleteShowThumb}`));
            }
            const genres = await Genre.findOne({
                _id: show.genres
            });
            genres.shows.pull(show._id);
            await genres.save();
            return {
                message: "Show deleted successfully!",
                showName: show.showName
            }
        })
    },
    Shows: {
        genres: async (parent, _, {loaders}) => {
            const genre = await loaders.genres.load(parent.genres.toString());
            return genre;
        },
        season: async (parent) => {
            const season = await Season.find({
                _id: parent.seasonName
            });
            return season;
        }
    }
}