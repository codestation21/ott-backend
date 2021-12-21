const {combineResolvers} = require('graphql-resolvers');
const {parse, join} = require("path");
const {createWriteStream} = require("fs");
const fs = require("fs");

const {Slider, validate} = require('../Model/sliderModel');
const {Movie} = require('../Model/movieModel');
const {Show} = require('../Model/showsModel');
const {Sports} = require('../Model/sports');
const {Tv} = require('../Model/tvModel');
const {Genre} = require('../Model/genreModel');
const {isAuthenticated} = require('../Middlewares/Authorize');
const {isAdmin} = require('../Middlewares/Admin');
const {isSubscriber} = require('../Middlewares/Subscriber');


module.exports = {
    Query: {
        getSliderList: async () => {
            const slider = await Slider.find();
            if (slider.length === 0) throw new Error("Slider list is empty!");
            return slider;
        },
        getSliderById: combineResolvers(isAuthenticated, isSubscriber, async (_, {id}) => {
            const slider = await Slider.findOne({
                _id: id
            });
            if (!slider) throw new Error("Slider not found!");
            return slider;
        })
    },
    Mutation: {
        addSlider: combineResolvers(isAuthenticated, isAdmin, async (_, {sliderImage, input}) => {
            const {error} = validate(input);
            if (error) throw new Error(error.details[0].message);
            var {filename, createReadStream} = await sliderImage;
            var stream = createReadStream();
            var {ext, name} = parse(filename);
            name = `suparott${Math.floor((Math.random() * 10000) + 1)}`;
            let imageUrl = join(__dirname, `../Upload/Image/${name}-${Date.now()}${ext}`);
            const iamageStrem = await createWriteStream(imageUrl)
            await stream.pipe(iamageStrem);
            const baseUrl = process.env.BASE_URL
            const port = process.env.PORT
            imageUrl = `${baseUrl}${port}${imageUrl.split('Upload')[1]}`;
            const slider = new Slider({...input, sliderThumb: imageUrl});
            const result = await slider.save();
            return {
                message: "Slider added successfully",
                id: result._id,
                sliderTitle: result.sliderTitle
            }
        }),
        updateSlider: combineResolvers(isAuthenticated, isAdmin, async (_, {sliderImage, id, input}) => {
            const slider = await Slider.findOne({
                _id: id
            });
            if (!slider) throw new Error("Slider not found!");
            const sliderFileUp = await sliderImage;
            if (sliderFileUp && slider.sliderThumb) {
                const deleteSlider = slider.sliderThumb.split('Image')[1].replace(/\\/g, "");
                fs.unlinkSync(join(__dirname, `../Upload/Image/${deleteSlider}`));
            }
            if (sliderFileUp) {
                var {filename, createReadStream} = sliderFileUp;
                var stream = createReadStream();
                var {ext, name} = parse(filename);
                name = `suparott${Math.floor((Math.random() * 10000) + 1)}`;
                let imageUrl = join(__dirname, `../Upload/Image/${name}-${Date.now()}${ext}`);
                const iamageStrem = await createWriteStream(imageUrl)
                await stream.pipe(iamageStrem);
                const baseUrl = process.env.BASE_URL
                const port = process.env.PORT
                imageUrl = `${baseUrl}${port}${imageUrl.split('Upload')[1]}`;
                const result = await Slider.findByIdAndUpdate(id, {...input, sliderThumb: imageUrl}, {new: true});
                return {
                    message: "Slider updated successfully",
                    id: result._id,
                    sliderTitle: result.sliderTitle
                }
            } else {
                const result = await Slider.findByIdAndUpdate(id, {...input}, {new: true});
                return {
                    message: "Slider updated successfully",
                    id: result._id,
                    sliderTitle: result.sliderTitle
                }
            }
        }),
        deleteSlider: combineResolvers(isAuthenticated, isAdmin, async (_, {id}) => {
            const slider = await Slider.findByIdAndDelete(id);
            if (!slider) throw new Error("Slider not found!");
            if (slider.sliderThumb) {
                const deleteSlider = slider.sliderThumb.split('Image')[1].replace(/\\/g, "");
                fs.unlinkSync(join(__dirname, `../Upload/Image/${deleteSlider}`));
            }
            return {
                message: "Slider deleted successfully!",
                sliderTitle: slider.sliderTitle
            }
        })
    },
    Sliders: {
        posts: async (parent, _, {loaders}) => {
            if (parent.postType === 'Movies') {
                const movies = await loaders.movies.load(parent.postInfo.toString())
                return {
                    id: movies._id,
                    access: movies.movieAccess,
                    title: movies.movieName,
                    postType: parent.postType,
                    genres: movies.genres,
                    status: movies.status,
                    imdbRating: movies.imdbRating,
                    releaseDate: movies.releaseDate,
                    duration: movies.duration
                }
            } else if (parent.postType === 'TV Shows') {
                const shows = await loaders.shows.load(parent.postInfo.toString());
                return {
                    id: shows._id,
                    title: shows.showName,
                    genres: shows.genres,
                    postType: parent.postType,
                    status: shows.status,
                    imdbRating: shows.imdbRating,
                    releaseDate: shows.releaseDate
                }
            } else if (parent.postType === 'Sports') {
                const sport = await loaders.sports.load(parent.postInfo.toString());
                return {
                    id: sport._id,
                    access: sport.access,
                    title: sport.sportsTitle,
                    genres: sport.sportCategory,
                    postType: parent.postType,
                    status: sport.status,
                    releaseDate: sport.releaseDate,
                    duration: sport.duration
                }
            } else if (parent.postType === 'Live TV') {
                const tv = await loaders.tvs.load(parent.postInfo.toString());
                return {
                    id: tv._id,
                    access: tv.tvAccess,
                    title: tv.tvName,
                    genres: tv.tvCategory,
                    postType: parent.postType,
                    status: tv.status
                }
            }
        }
    },
    sliderPost: {
        genres: async (parent, _, {loaders}) => {
            console.log(parent);
            if (parent.postType === 'Movies' || parent.postType === 'TV Shows') {
                const genres = await loaders.genres.load(parent.genres.toString())
                return genres;
            } else if (parent.postType === 'Sports') {
                const sports = await loaders.scategory.load(parent.genres.toString())
                return {
                    id: sports._id,
                    name: sports.sportCategory
                }
            } else if (parent.postType === 'Live TV') {
                const tvs = await loaders.tvcategory.load(parent.genres.toString());
                return {
                    id: tvs._id,
                    name: tvs.tvCategory
                }
            }
        }
    }
}