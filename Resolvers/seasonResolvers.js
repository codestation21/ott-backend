const {combineResolvers} = require('graphql-resolvers');
const {parse, join} = require("path");
const {createWriteStream} = require("fs");
const fs = require("fs");

const {Season, validate} = require('../Model/seasonModel');
const {Show} = require('../Model/showsModel');
const {Episode} = require('../Model/episodeModel')
const {isAuthenticated} = require('../Middlewares/Authorize');
const {isAdmin} = require('../Middlewares/Admin');
const {Genre} = require("../Model/genreModel");
const {isSubscriber} = require('../Middlewares/Subscriber');


module.exports = {
    Query: {
        getSeasonList: combineResolvers(isAuthenticated, async () => {
            const season = await Season.find();
            if (season.length === 0) throw new Error("Season not found");
            return season;
        }),
        getSeasonById: combineResolvers(isAuthenticated, isSubscriber, async (_, {id}) => {
            const season = await Season.findOne({
                _id: id
            });
            if (!season) throw new Error("Season not found!");
            return season;
        })
    },
    Mutation: {
        addSeason: combineResolvers(isAuthenticated, isAdmin, async (_, {seasonThumb, input}) => {
            const {error} = validate(input);
            if (error) throw new Error(error.details[0].message);
            var {filename, createReadStream} = await seasonThumb;
            var stream = createReadStream();
            var {ext, name} = parse(filename);
            name = `suparott${Math.floor((Math.random() * 100000) + 1)}`;
            let imageFile = join(__dirname, `../Upload/Image/${name}-${Date.now()}${ext}`);
            const iamageStrem = await createWriteStream(imageFile)
            await stream.pipe(iamageStrem);
            const baseUrl = process.env.BASE_URL
            const port = process.env.PORT
            imageFile = `${baseUrl}${port}${imageFile.split('Upload')[1]}`;
            const season = new Season({...input, seasonThumb: imageFile});
            const result = await season.save();
            const show = await Show.findOne({
                _id: input.shows
            });
            show.seasonName.push(result._id);
            await show.save();
            return {
                message: "Season Add successfully!",
                id: result._id,
                seasonTitle: result.seasonTitle,
                status: result.status
            }
        }),
        updateSeason: combineResolvers(isAuthenticated, isAdmin, async (_, {seasonThumb, id, input}) => {
            const season = await Season.findOne({
                _id: id
            });
            if (!season) throw new Error("Season not found!");
            const seasonThumbUp = await seasonThumb;
            if (seasonThumbUp && season.seasonThumb) {
                const deleteSeasonThumb = season.seasonThumb.split('Image')[1].replace(/\\/g, "");
                fs.unlinkSync(join(__dirname, `../Upload/Image/${deleteSeasonThumb}`));
            }
            if (seasonThumbUp) {
                var {filename, createReadStream} = await seasonThumb;
                var stream = createReadStream();
                var {ext, name} = parse(filename);
                name = `suparott${Math.floor((Math.random() * 100000) + 1)}`;
                let imageFile = join(__dirname, `../Upload/Image/${name}-${Date.now()}${ext}`);
                const iamageStrem = await createWriteStream(imageFile)
                await stream.pipe(iamageStrem);
                const baseUrl = process.env.BASE_URL
                const port = process.env.PORT
                imageFile = `${baseUrl}${port}${imageFile.split('Upload')[1]}`;
                const result = await Season.findByIdAndUpdate(id, {...input, seasonThumb: imageFile}, {new: true});
                if (input.shows) {
                    const oldShows = await Show.findOne({
                        _id: season.shows
                    })
                    oldShows.seasonName.pull(season._id);
                    await oldShows.save();
                    const newShows = await Show.findOne({
                        _id: input.shows
                    })
                    newShows.seasonName.push(season._id);
                    await newShows.save();
                }
                return {
                    message: "Season Updated successfully!",
                    id: result._id,
                    seasonTitle: result.seasonTitle,
                    status: result.status
                }
            } else {
                const result = await Season.findByIdAndUpdate(id, {...input}, {new: true});
                if (input.shows) {
                    const oldShows = await Show.findOne({
                        _id: season.shows
                    })
                    oldShows.seasonName.pull(season._id);
                    await oldShows.save();
                    const newShows = await Show.findOne({
                        _id: input.shows
                    })
                    newShows.seasonName.push(season._id);
                    await newShows.save();
                }
                return {
                    message: "Season Updated successfully!",
                    id: result._id,
                    seasonTitle: result.seasonTitle,
                    status: result.status
                }
            }
        }),
        deleteSeason: combineResolvers(isAuthenticated, isAdmin, async (_, {id}) => {
            const season = await Season.findByIdAndDelete(id);
            if (!season) throw new Error("Season not Found");
            if (season.seasonThumb) {
                const deleteSeasonThumb = season.seasonThumb.split('Image')[1].replace(/\\/g, "");
                fs.unlinkSync(join(__dirname, `../Upload/Image/${deleteSeasonThumb}`));
            }
            const shows = await Show.findOne({
                _id: season.shows
            });
            shows.seasonName.pull(season._id);
            await shows.save();
            return {
                message: "Season Deleted Successfully!",
                seasonTitle: season.seasonTitle
            }
        })
    },
    Seasons: {
        shows: async (parent, _, {loaders}) => {
            const show = await loaders.shows.load(parent.shows.toString())
            return show;
        },
        episode: async (parent) => {
            const episode = await Episode.find({
                _id: parent.episode
            });
            return episode;
        }
    }
}