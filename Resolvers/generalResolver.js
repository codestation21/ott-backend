const {combineResolvers} = require('graphql-resolvers');

const {General} = require('../Model/generalModel');
const {isAuthenticated} = require('../Middlewares/Authorize');
const {isAdmin} = require('../Middlewares/Admin');
const fs = require("fs");
const {join, parse} = require("path");
const {createWriteStream} = require("fs");

module.exports = {
    Query: {
        generalSettings: async () => {
            const general = await General.findOne();
            if (!general) throw new Error("Please set all general seetings");
            return general;
        }
    },
    Mutation: {
        addGeneral: combineResolvers(isAuthenticated, isAdmin, async (_, {siteLogo, siteIcon, input}) => {
            const general = await General.findOne();
            const siteLogoFile = await siteLogo;
            const siteIconFile = await siteIcon;
            const baseUrl = process.env.BASE_URL;
            const port = process.env.PORT;
            if (general) {
                if (siteLogoFile && general.siteLogo) {
                    const deleteGeneral = general.siteLogo.split('Image')[1].replace(/\\/g, "");
                    fs.unlinkSync(join(__dirname, `../Upload/Image/${deleteGeneral}`));
                }
                if (siteIconFile && general.siteFavicon) {
                    const deleteGeneral = general.siteFavicon.split('Image')[1].replace(/\\/g, "");
                    fs.unlinkSync(join(__dirname, `../Upload/Image/${deleteGeneral}`));
                }
            }
            if (siteLogoFile && !siteIconFile) {
                var {filename, createReadStream} = siteLogoFile;
                var stream = createReadStream();
                var {ext, name} = parse(filename);
                name = `suparott${Math.floor((Math.random() * 10000) + 1)}`;
                let logoUrl = join(__dirname, `../Upload/Image/${name}-${Date.now()}${ext}`);
                const iamageStrem = await createWriteStream(logoUrl)
                await stream.pipe(iamageStrem);
                logoUrl = `${baseUrl}${port}${logoUrl.split('Upload')[1]}`
                if (general) {
                    const generalSettings = await General.findByIdAndUpdate(general._id, {
                        ...input,
                        siteLogo: logoUrl
                    }, {new: true});
                    return {
                        message: "General Settings updated Succeessfully!"
                    }
                } else {
                    const generalSettings = new General({...input, siteLogo: logoUrl});
                    const result = await generalSettings.save();
                    return {
                        message: 'General Setting set successfully!'
                    }
                }
            } else if (!siteLogoFile && siteIconFile) {
                var {filename, createReadStream} = siteIconFile;
                var stream = createReadStream();
                var {ext, name} = parse(filename);
                name = `suparott${Math.floor((Math.random() * 10000) + 1)}`;
                let iconUrl = join(__dirname, `../Upload/Image/${name}-${Date.now()}${ext}`);
                const iconStream = await createWriteStream(iconUrl)
                await stream.pipe(iconStream);
                iconUrl = `${baseUrl}${port}${iconUrl.split('Upload')[1]}`
                if (general) {
                    const generalSettings = await General.findByIdAndUpdate(general._id, {
                        ...input,
                        siteFavicon: iconUrl
                    }, {new: true});
                    return {
                        message: "General Settings updated Succeessfully!"
                    }
                } else {
                    const generalSettings = new General({...input, siteFavicon: iconUrl});
                    const result = await generalSettings.save();
                    return {
                        message: 'General Setting set successfully!'
                    }
                }
            } else if (siteLogoFile && siteIconFile) {
                var {filename, createReadStream} = siteLogoFile;
                var stream = createReadStream();
                var {ext, name} = parse(filename);
                name = `suparott${Math.floor((Math.random() * 10000) + 1)}`;
                let logoUrl = join(__dirname, `../Upload/Image/${name}-${Date.now()}${ext}`);
                const iamageStrem = await createWriteStream(logoUrl)
                await stream.pipe(iamageStrem);
                logoUrl = `${baseUrl}${port}${logoUrl.split('Upload')[1]}`
                var {filename, createReadStream} = siteIconFile;
                var stream = createReadStream();
                var {ext, name} = parse(filename);
                name = `suparott${Math.floor((Math.random() * 10000) + 1)}`;
                let iconUrl = join(__dirname, `../Upload/Image/${name}-${Date.now()}${ext}`);
                const iconStream = await createWriteStream(iconUrl)
                await stream.pipe(iconStream);
                iconUrl = `${baseUrl}${port}${iconUrl.split('Upload')[1]}`
                if (general) {
                    const generalSettings = await General.findByIdAndUpdate(general._id, {
                        ...input,
                        siteLogo: logoUrl,
                        siteFavicon: iconUrl
                    }, {new: true});
                    return {
                        message: "General Settings updated Succeessfully!"
                    }
                } else {
                    const generalSettings = new General({...input, siteLogo: logoUrl, siteFavicon: iconUrl});
                    const result = await generalSettings.save();
                    return {
                        message: 'General Setting set successfully!'
                    }
                }
            } else {
                if (general) {
                    const generalSettings = await General.findByIdAndUpdate(general._id, {
                        ...input
                    }, {new: true});
                    return {
                        message: "General Settings updated Succeessfully!"
                    }
                } else {
                    const generalSettings = new General({...input});
                    const result = await generalSettings.save();
                    return {
                        message: 'General Setting set successfully!'
                    }
                }
            }
        })
    }
}