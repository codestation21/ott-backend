const {combineResolvers} = require('graphql-resolvers');
const {parse, join} = require("path");
const {createWriteStream} = require("fs");
const fs = require("fs");

const {Episode, validate} = require('../Model/episodeModel');
const {Season} = require('../Model/seasonModel');
const {isAuthenticated} = require('../Middlewares/Authorize');
const {isAdmin} = require('../Middlewares/Admin');
const {isSubscriber} = require('../Middlewares/Subscriber');


module.exports = {
    Query: {
        getEpisodeList: combineResolvers(isAuthenticated, async () => {
            const episode = await Episode.find();
            if (episode.length === 0) throw new Error("Episode list epmty!");
            return episode
        }),
        getEpisodeById: combineResolvers(isAuthenticated, isSubscriber, async (_, {id}) => {
            const episode = await Episode.findOne({
                _id: id
            });
            if (!episode) throw new Error("Episode not found!");
            return episode;
        })
    },
    Mutation: {
        addEpisode: combineResolvers(isAuthenticated, isAdmin, async (_, {imageFile, videoFile, input}) => {
            const {error} = validate(input);
            if (error) throw new Error(error.details[0].message);
            var {filename, createReadStream} = await imageFile;
            var stream = createReadStream();
            var {ext, name} = parse(filename);
            name = `suparott${Math.floor((Math.random() * 10000) + 1)}`;
            let imageUrl = join(__dirname, `../Upload/Image/${name}-${Date.now()}${ext}`);
            const iamageStrem = await createWriteStream(imageUrl)
            await stream.pipe(iamageStrem);
            const baseUrl = process.env.BASE_URL
            const port = process.env.PORT
            imageUrl = `${baseUrl}${port}${imageUrl.split('Upload')[1]}`
            const videoFileUp = await videoFile;
            if (videoFileUp) {
                var {filename, createReadStream} = videoFileUp;
                var stream = createReadStream();
                var {ext, name} = parse(filename);
                name = `suparott${Math.floor((Math.random() * 10000) + 1)}`;
                let videoUrl = join(__dirname, `../Upload/Video/${name}-${Date.now()}${ext}`);
                const videoStream = await createWriteStream(videoUrl)
                await stream.pipe(videoStream);
                videoUrl = `${baseUrl}${port}${videoUrl.split('Upload')[1]}`;
                const episode = new Episode({...input, episodeThumb: imageUrl, localVideo: videoUrl});
                const result = await episode.save();
                const season = await Season.findOne({
                    _id: input.seasons
                });
                season.episode.push(result._id);
                await season.save();
                return {
                    message: "Episode added successsfully!",
                    id: result._id,
                    episodeTitle: result.episodeTitle,
                    status: result.status
                }
            } else {
                const episode = new Episode({...input, episodeThumb: imageUrl});
                const result = await episode.save();
                const season = await Season.findOne({
                    _id: input.seasons
                });
                season.episode.push(result._id);
                await season.save();
                return {
                    message: "Episode added successsfully!",
                    id: result._id,
                    episodeTitle: result.episodeTitle,
                    status: result.status
                }
            }
        }),
        updateEpisode: combineResolvers(isAuthenticated, isAdmin, async (_, {imageFile, videoFile, id, input}) => {
            const episode = await Episode.findOne({
                _id: id
            });
            if (!episode) throw new Error("Episode not found!");
            const imageFileUp = await imageFile;
            const videoFileUp = await videoFile;
            const baseUrl = process.env.BASE_URL;
            const port = process.env.PORT;
            if (imageFileUp && episode.episodeThumb) {
                const deleteEpisode = episode.episodeThumb.split('Image')[1].replace(/\\/g, "");
                fs.unlinkSync(join(__dirname, `../Upload/Image/${deleteEpisode}`));
            }
            if (videoFileUp && episode.localVideo) {
                const deleteEpisode = episode.localVideo.split('Video')[1].replace(/\\/g, "");
                fs.unlinkSync(join(__dirname, `../Upload/Video/${deleteEpisode}`));
            }
            if (imageFileUp && !videoFileUp) {
                var {filename, createReadStream} = imageFileUp;
                var stream = createReadStream();
                var {ext, name} = parse(filename);
                name = `suparott${Math.floor((Math.random() * 10000) + 1)}`;
                let imageUrl = join(__dirname, `../Upload/Image/${name}-${Date.now()}${ext}`);
                const iamageStrem = await createWriteStream(imageUrl)
                await stream.pipe(iamageStrem);
                imageUrl = `${baseUrl}${port}${imageUrl.split('Upload')[1]}`
                if (input.seasons) {
                    const oldSeason = await Season.findOne({
                        _id: episode.seasons
                    })
                    oldSeason.episode.pull(episode._id);
                    await oldSeason.save();
                    const newSeason = await Season.findOne({
                        _id: input.seasons
                    })
                    newSeason.episode.push(episode._id);
                    await newSeason.save();
                }
                const result = await Episode.findByIdAndUpdate(id, {
                    ...input,
                    episodeThumb: imageUrl
                }, {new: true});
                return {
                    message: "Movie Updated successfully!",
                    id: result._id,
                    episodeTitle: result.episodeTitle,
                    status: result.status
                }
            } else if (!imageFileUp && videoFileUp) {
                var {filename, createReadStream} = videoFileUp;
                var stream = createReadStream();
                var {ext, name} = parse(filename);
                name = `suparott${Math.floor((Math.random() * 10000) + 1)}`;
                let videoUrl = join(__dirname, `../Upload/Video/${name}-${Date.now()}${ext}`);
                const videoStream = await createWriteStream(videoUrl)
                await stream.pipe(videoStream);
                videoUrl = `${baseUrl}${port}${videoUrl.split('Upload')[1]}`;
                if (input.seasons) {
                    const oldSeason = await Season.findOne({
                        _id: episode.seasons
                    })
                    oldSeason.episode.pull(episode._id);
                    await oldSeason.save();
                    const newSeason = await Season.findOne({
                        _id: input.seasons
                    })
                    newSeason.episode.push(episode._id);
                    await newSeason.save();
                }
                const result = await Episode.findByIdAndUpdate(id, {
                    ...input,
                    localVideo: videoUrl
                }, {new: true});
                return {
                    message: "Movie Updated successfully!",
                    id: result._id,
                    episodeTitle: result.episodeTitle,
                    status: result.status
                }
            } else if (imageFileUp && videoFileUp) {
                var {filename, createReadStream} = imageFileUp;
                var stream = createReadStream();
                var {ext, name} = parse(filename);
                name = `suparott${Math.floor((Math.random() * 10000) + 1)}`;
                let imageUrl = join(__dirname, `../Upload/Image/${name}-${Date.now()}${ext}`);
                const iamageStrem = await createWriteStream(imageUrl)
                await stream.pipe(iamageStrem);
                imageUrl = `${baseUrl}${port}${imageUrl.split('Upload')[1]}`
                var {filename, createReadStream} = videoFileUp;
                var stream = createReadStream();
                var {ext, name} = parse(filename);
                name = `suparott${Math.floor((Math.random() * 10000) + 1)}`;
                let videoUrl = join(__dirname, `../Upload/Video/${name}-${Date.now()}${ext}`);
                const videoStream = await createWriteStream(videoUrl)
                await stream.pipe(videoStream);
                videoUrl = `${baseUrl}${port}${videoUrl.split('Upload')[1]}`;
                if (input.seasons) {
                    const oldSeason = await Season.findOne({
                        _id: episode.seasons
                    })
                    oldSeason.episode.pull(episode._id);
                    await oldSeason.save();
                    const newSeason = await Season.findOne({
                        _id: input.seasons
                    })
                    newSeason.episode.push(episode._id);
                    await newSeason.save();
                }
                const result = await Episode.findByIdAndUpdate(id, {
                    ...input,
                    episodeThum: imageUrl,
                    localVideo: videoUrl
                }, {new: true});
                return {
                    message: "Movie Updated successfully!",
                    id: result._id,
                    episodeTitle: result.episodeTitle,
                    status: result.status
                }
            } else {
                if (input.seasons) {
                    const oldSeason = await Season.findOne({
                        _id: episode.seasons
                    })
                    oldSeason.episode.pull(episode._id);
                    await oldSeason.save();
                    const newSeason = await Season.findOne({
                        _id: input.seasons
                    })
                    newSeason.episode.push(episode._id);
                    await newSeason.save();
                }
                const result = await Episode.findByIdAndUpdate(id, {
                    ...input
                }, {new: true});
                return {
                    message: "Movie Updated successfully!",
                    id: result._id,
                    episodeTitle: result.episodeTitle,
                    status: result.status
                }
            }
        }),
        deleteEpisode: combineResolvers(isAuthenticated, isAdmin, async (_, {id}) => {
            const episode = await Episode.findByIdAndDelete(id);
            if (!episode) throw new Error("Episode not found!")
            if (episode.episodeThumb) {
                const deleteEpisode = episode.episodeThumb.split('Image')[1].replace(/\\/g, "");
                fs.unlinkSync(join(__dirname, `../Upload/Image/${deleteEpisode}`));
            }
            if (episode.localVideo) {
                const deleteEpisode = episode.localVideo.split('Video')[1].replace(/\\/g, "");
                fs.unlinkSync(join(__dirname, `../Upload/Video/${deleteEpisode}`));
            }
            const season = await Season.findOne({
                _id: episode.seasons
            });
            season.episode.pull(episode._id);
            await season.save();
            return {
                message: "Episode deleted Successfully!",
                episodeTitle: episode.episodeTitle
            }
        })
    },
    Episodes: {
        seasons: async (parent, _, {loaders}) => {
            const season = await loaders.seasons.load(parent.seasons.toString())
            return season
        }
    }
}