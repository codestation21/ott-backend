const {combineResolvers} = require('graphql-resolvers');

const {Language, validate} = require('../Model/lanModel');
const {isAuthenticated} = require('../Middlewares/Authorize');
const {isAdmin} = require('../Middlewares/Admin');
const {parse, join} = require("path");
const {createWriteStream} = require("fs");
const fs = require("fs");


module.exports = {
    Query: {
        getLanguage: async () => {
            const language = await Language.find();
            if (language.length === 0) throw new Error("Language list is empty!");
            return language;
        }
    },
    Mutation: {
        addLanguage: combineResolvers(isAuthenticated, isAdmin, async (_, {lanThumb, input}) => {
            const {error} = validate(input);
            if (error) throw new Error(error.details[0].message);
            var {filename, createReadStream} = await lanThumb;
            var stream = createReadStream();
            var {ext, name} = parse(filename);
            name = `suparott${Math.floor((Math.random() * 10000) + 1)}`;
            let imageUrl = join(__dirname, `../Upload/Image/${name}-${Date.now()}${ext}`);
            const iamageStrem = await createWriteStream(imageUrl)
            await stream.pipe(iamageStrem);
            const baseUrl = process.env.BASE_URL
            const port = process.env.PORT
            imageUrl = `${baseUrl}${port}${imageUrl.split('Upload')[1]}`
            const language = new Language({...input, lanThumb: imageUrl});
            const result = await language.save();
            return {
                message: "Language added successfully!",
                id: result._id,
                language: result.language
            }
        }),
        updateLanguage: combineResolvers(isAuthenticated, isAdmin, async (_, {lanThumb, id, input}) => {
            const language = await Language.findOne({
                _id: id
            });
            if (!language) throw new Error("Language not found!");
            const lanThumbFile = await lanThumb
            if (lanThumbFile && language.lanThumb) {
                const deletelan = language.lanThumb.split('Image')[1].replace(/\\/g, "");
                fs.unlinkSync(join(__dirname, `../Upload/Image/${deletelan}`));
            }
            if (lanThumbFile) {
                var {filename, createReadStream} = lanThumbFile;
                var stream = createReadStream();
                var {ext, name} = parse(filename);
                name = `suparott${Math.floor((Math.random() * 10000) + 1)}`;
                let imageUrl = join(__dirname, `../Upload/Image/${name}-${Date.now()}${ext}`);
                const iamageStrem = await createWriteStream(imageUrl)
                await stream.pipe(iamageStrem);
                const baseUrl = process.env.BASE_URL
                const port = process.env.PORT
                imageUrl = `${baseUrl}${port}${imageUrl.split('Upload')[1]}`
                const result = await Language.findByIdAndUpdate(id, {...input, lanThumb: imageUrl}, {new: true});
                return {
                    message: "Language added successfully!",
                    id: result._id,
                    language: result.language
                }
            } else {
                const result = await Language.findByIdAndUpdate(id, {...input}, {new: true});
                return {
                    message: "Language added successfully!",
                    id: result._id,
                    language: result.language
                }
            }
        }),
        deleteLanguage: combineResolvers(isAuthenticated, isAdmin, async (_, {id}) => {
            const language = await Language.findByIdAndDelete(id);
            if (!language) throw new Error("Language not found!");
            if (language.lanThumb) {
                const deletelan = language.lanThumb.split('Image')[1].replace(/\\/g, "");
                fs.unlinkSync(join(__dirname, `../Upload/Image/${deletelan}`));
            }
            return {
                message: "Language deleted successfully!"
            }
        })
    }
}