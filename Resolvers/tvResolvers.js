const {combineResolvers} = require('graphql-resolvers');
const {parse, join} = require("path");
const {createWriteStream} = require("fs");
const fs = require("fs");
const {Scategory} = require("../Model/sportsCategory");

const {Tv, validate} = require('../Model/tvModel');
const {Tvcategory} = require('../Model/tvCategory');
const {isAuthenticated} = require('../Middlewares/Authorize');
const {isAdmin} = require('../Middlewares/Admin');
const {isSubscriber} = require('../Middlewares/Subscriber');

module.exports = {
    Query: {
        getTvList: combineResolvers(isAuthenticated, async () => {
            const tv = await Tv.find();
            if (tv.length === 0) throw new Error("Tv List is empty!");
            return tv;
        }),
        getTvById: combineResolvers(isAuthenticated, isSubscriber, async (_, {id}) => {
            const tv = await Tv.findOne({
                _id: id
            });
            if (!tv) throw new Error("Tv channel not found!");
            return tv;
        })
    },
    Mutation: {
        addTv: combineResolvers(isAuthenticated, isAdmin, async (_, {tvLogo, input}) => {
            const {error} = validate(input);
            if (error) throw new Error(error.details[0].message);
            var {filename, createReadStream} = await tvLogo;
            var stream = createReadStream();
            var {ext, name} = parse(filename);
            name = `suparott${Math.floor((Math.random() * 10000) + 1)}`;
            let imageUrl = join(__dirname, `../Upload/Image/${name}-${Date.now()}${ext}`);
            const iamageStrem = await createWriteStream(imageUrl)
            await stream.pipe(iamageStrem);
            const baseUrl = process.env.BASE_URL
            const port = process.env.PORT
            imageUrl = `${baseUrl}${port}${imageUrl.split('Upload')[1]}`;
            const tv = new Tv({...input, tvLogo: imageUrl});
            const result = await tv.save();
            const tvcategory = await Tvcategory.findOne({
                _id: input.tvCategory
            });
            tvcategory.tv.push(result._id);
            await tvcategory.save();
            return {
                message: "Tv Channel added successfully!",
                id: result._id,
                tvName: result.tvName,
                status: result.status
            }
        }),
        updateTv: combineResolvers(isAuthenticated, isAdmin, async (_, {tvLogo, id, input}) => {
            const tv = await Tv.findOne({
                _id: id
            });
            if (!tv) throw new Error("Tv Channel not found!");
            const tvImageFile = await tvLogo;
            if (tvImageFile && tv.tvLogo) {
                const deleteTv = tv.tvLogo.split('Image')[1].replace(/\\/g, "");
                fs.unlinkSync(join(__dirname, `../Upload/Image/${deleteTv}`));
            }
            if (tvImageFile) {
                var {filename, createReadStream} = tvImageFile;
                var stream = createReadStream();
                var {ext, name} = parse(filename);
                name = `suparott${Math.floor((Math.random() * 10000) + 1)}`;
                let imageUrl = join(__dirname, `../Upload/Image/${name}-${Date.now()}${ext}`);
                const iamageStrem = await createWriteStream(imageUrl)
                await stream.pipe(iamageStrem);
                const baseUrl = process.env.BASE_URL
                const port = process.env.PORT
                imageUrl = `${baseUrl}${port}${imageUrl.split('Upload')[1]}`;
                if (input.tvCategory) {
                    const oldTvcategory = await Tvcategory.findOne({
                        _id: tv.tvCategory
                    })
                    oldTvcategory.tv.pull(tv._id);
                    await oldTvcategory.save();
                    const newTvcategory = await Tvcategory.findOne({
                        _id: input.tvCategory
                    })
                    newTvcategory.tv.push(tv._id);
                    await newTvcategory.save();
                }
                const result = await Tv.findByIdAndUpdate(id, {...input, tvLogo: imageUrl}, {new: true});
                return {
                    message: "Tv Channel updated successfully!",
                    id: result._id,
                    tvName: result.tvName,
                    status: result.status
                }
            } else {
                if (input.tvCategory) {
                    const oldTvcategory = await Tvcategory.findOne({
                        _id: tv.tvCategory
                    })
                    oldTvcategory.tv.pull(tv._id);
                    await oldTvcategory.save();
                    const newTvcategory = await Tvcategory.findOne({
                        _id: input.tvCategory
                    })
                    newTvcategory.tv.push(tv._id);
                    await newTvcategory.save();
                }
                const result = await Tv.findByIdAndUpdate(id, {...input}, {new: true});
                return {
                    message: "Tv Channel updated successfully!",
                    id: result._id,
                    tvName: result.tvName,
                    status: result.status
                }
            }
        }),
        deleteTv: combineResolvers(isAuthenticated, isAdmin, async (_, {id}) => {
            const tv = await Tv.findByIdAndDelete(id);
            if (!tv) throw new Error("Tv Channel not found!");
            if (tv.tvLogo) {
                const deleteTv = tv.tvLogo.split('Image')[1].replace(/\\/g, "");
                fs.unlinkSync(join(__dirname, `../Upload/Image/${deleteTv}`));
            }
            const tvcategory = await Tvcategory.findOne({
                _id: tv.tvCategory
            });
            tvcategory.tv.pull(tv._id);
            await tvcategory.save();
            return {
                message: "Tv channel deleted successfully!",
                tvName: tv.tvName
            }
        })
    },
    Tvs: {
        tvCategory: async (parent, _, {loaders}) => {
            const tvcategory = await loaders.tvcategory.load(parent.tvCategory.toString());
            return tvcategory;
        }
    }
}