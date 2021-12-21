const {combineResolvers} = require('graphql-resolvers');
const {parse, join} = require("path");
const {createWriteStream} = require("fs");
const fs = require("fs");

const {Sports, validate} = require('../Model/sports');
const {Scategory} = require('../Model/sportsCategory');
const {isAuthenticated} = require('../Middlewares/Authorize');
const {isAdmin} = require('../Middlewares/Admin');
const {isSubscriber} = require('../Middlewares/Subscriber')


module.exports = {
    Query: {
        getSportsList: combineResolvers(isAuthenticated, async () => {
            const sport = await Sports.find();
            if (sport.length === 0) throw new Error("Sport List is empty!");
            return sport;
        }),
        getSportsById: combineResolvers(isAuthenticated, isSubscriber, async (_, {id}) => {
            const sport = await Sports.findOne({
                _id: id
            });
            if (!sport) throw new Error("Sport video not found!");
            return sport;
        })
    },
    Mutation: {
        addSports: combineResolvers(isAuthenticated, isAdmin, async (_, {imageFile, videoFile, input}) => {
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
            imageUrl = `${baseUrl}${port}${imageUrl.split('Upload')[1]}`;
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
                const sport = new Sports({...input, sportsThumb: imageUrl, localVideo: videoUrl});
                const result = await sport.save();
                const scategory = await Scategory.findOne({
                    _id: input.sportCategory
                });
                scategory.sports.push(result._id);
                await scategory.save();
                return {
                    message: "Sports Video added successfully!",
                    id: result._id,
                    sportsTitle: result.sportsTitle,
                    status: result.status
                }
            } else {
                const sport = new Sports({...input, sportsThumb: imageUrl});
                const result = await sport.save();
                const scategory = await Scategory.findOne({
                    _id: input.sportCategory
                });
                scategory.sports.push(result._id);
                await scategory.save();
                return {
                    message: "Sports Video added successfully!",
                    id: result._id,
                    sportsTitle: result.sportsTitle,
                    status: result.status
                }
            }
        }),
        updateSports: combineResolvers(isAuthenticated, isAdmin, async (_, {imageFile, videoFile, id, input}) => {
            const sport = await Sports.findOne({
                _id: id
            });
            if (!sport) throw new Error("Sport Video not found!");
            const imageFileUp = await imageFile;
            const videoFileUp = await videoFile;
            const baseUrl = process.env.BASE_URL;
            const port = process.env.PORT;
            if (imageFileUp && sport.sportsThumb) {
                const deleteSport = sport.sportsThumb.split('Image')[1].replace(/\\/g, "");
                fs.unlinkSync(join(__dirname, `../Upload/Image/${deleteSport}`));
            }
            if (videoFileUp && sport.localVideo) {
                const deleteSport = sport.localVideo.split('Video')[1].replace(/\\/g, "");
                fs.unlinkSync(join(__dirname, `../Upload/Video/${deleteSport}`));
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
                if (input.sportCategory) {
                    const oldScategory = await Scategory.findOne({
                        _id: sport.sportCategory
                    })
                    oldScategory.sports.pull(sport._id);
                    await oldScategory.save();
                    const newScategory = await Scategory.findOne({
                        _id: input.sportCategory
                    })
                    newScategory.sports.push(sport._id);
                    await newScategory.save();
                }
                const result = await Sports.findByIdAndUpdate(id, {...input, sportsThumb: imageUrl}, {new: true});
                return {
                    message: "Sport Video updated successfully!",
                    id: result._id,
                    sportsTitle: result.sportsTitle,
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
                if (input.sportCategory) {
                    const oldScategory = await Scategory.findOne({
                        _id: sport.sportCategory
                    })
                    oldScategory.sports.pull(sport._id);
                    await oldScategory.save();
                    const newScategory = await Scategory.findOne({
                        _id: input.sportCategory
                    })
                    newScategory.sports.push(sport._id);
                    await newScategory.save();
                }
                const result = await Sports.findByIdAndUpdate(id, {...input, localVideo: videoUrl}, {new: true});
                return {
                    message: "Sport Video updated successfully!",
                    id: result._id,
                    sportsTitle: result.sportsTitle,
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
                if (input.sportCategory) {
                    const oldScategory = await Scategory.findOne({
                        _id: sport.sportCategory
                    })
                    oldScategory.sports.pull(sport._id);
                    await oldScategory.save();
                    const newScategory = await Scategory.findOne({
                        _id: input.sportCategory
                    })
                    newScategory.sports.push(sport._id);
                    await newScategory.save();
                }
                const result = await Sports.findByIdAndUpdate(id, {
                    ...input,
                    sportsThumb: imageUrl,
                    localVideo: videoUrl
                }, {new: true});
                return {
                    message: "Sport Video updated successfully!",
                    id: result._id,
                    sportsTitle: result.sportsTitle,
                    status: result.status
                }
            } else {
                if (input.sportCategory) {
                    const oldScategory = await Scategory.findOne({
                        _id: sport.sportCategory
                    })
                    oldScategory.sports.pull(sport._id);
                    await oldScategory.save();
                    const newScategory = await Scategory.findOne({
                        _id: input.sportCategory
                    })
                    newScategory.sports.push(sport._id);
                    await newScategory.save();
                }
                const result = await Sports.findByIdAndUpdate(id, {
                    ...input
                }, {new: true});
                return {
                    message: "Sport Video updated successfully!",
                    id: result._id,
                    sportsTitle: result.sportsTitle,
                    status: result.status
                }
            }
        }),
        deleteSports: combineResolvers(isAuthenticated, isAdmin, async (_, {id}) => {
            const sport = await Sports.findByIdAndDelete(id);
            if (!sport) throw new Error("Sport video not found!");
            if (sport.sportsThumb) {
                const deleteSport = sport.sportsThumb.split('Image')[1].replace(/\\/g, "");
                fs.unlinkSync(join(__dirname, `../Upload/Image/${deleteSport}`));
            }
            if (sport.localVideo) {
                const deleteSport = sport.localVideo.split('Video')[1].replace(/\\/g, "");
                fs.unlinkSync(join(__dirname, `../Upload/Video/${deleteSport}`));
            }
            const scategory = await Scategory.findOne({
                _id: sport.sportCategory
            });
            scategory.sports.pull(sport._id);
            await scategory.save();
            return {
                message: "Sport Video Successfully!",
                sportsTitle: sport.sportsTitle
            }
        })
    },
    Sports: {
        sportCategory: async (parent, _, {loaders}) => {
            const scategory = await loaders.scategory.load(parent.sportCategory.toString());
            return scategory;
        }
    }
}