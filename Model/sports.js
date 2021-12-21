const {Schema, model} = require("mongoose");
const Joi = require('joi');

module.exports.Sports = model('Sports', Schema({
    access: {
        type: String,
        enum: ["paid", "free"]
    },
    sportCategory: {
        type: Schema.Types.ObjectId,
        ref: 'Scategory'
    },
    sportsTitle: {
        type: String,
        required: true
    },
    description: String,
    releaseDate: String,
    duration: String,
    status: Boolean,
    seoTitle: String,
    metaDescription: String,
    keyword: String,
    sportsThumb: {
        type: String,
        required: true
    },
    localVideo: String,
    urlVideo: String,
    embedCode: String,
    hlsVideo: String,
    mpegVideo: String,
    downloadUrl: String,
    subtitle: String
}, {timestamps: true}));

module.exports.validate = sports => {
    const schema = Joi.object({
        access: Joi.string().allow(""),
        sportCategory: Joi.string().required(),
        sportsTitle: Joi.string().required(),
        description: Joi.string().allow(""),
        releaseDate: Joi.string().allow(""),
        duration: Joi.string().allow(),
        status: Joi.boolean().allow(""),
        seoTitle: Joi.string().allow(""),
        metaDescription: Joi.string().allow(""),
        keyword: Joi.string().allow(""),
        urlVideo: Joi.string().allow(""),
        embedCode: Joi.string().allow(""),
        hlsVideo: Joi.string().allow(""),
        mpegVideo: Joi.string().allow(""),
        downloadUrl: Joi.string().allow(""),
        subtitle: Joi.string().allow("")
    });
    return schema.validate(sports);
}