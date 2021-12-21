const {Schema, model} = require('mongoose');
const Joi = require("joi");

module.exports.Episode = model('Episode', Schema({
    access: {
        type: String,
        enum: ["paid", "free"]
    },
    seasons: {
        type: Schema.Types.ObjectId,
        ref: 'Season',
        required: true
    },
    episodeTitle: {
        type: String,
        required: true
    },
    description: String,
    imdbRating: String,
    releaseDate: String,
    duration: String,
    status: Boolean,
    seoTitle: String,
    metaDescription: String,
    keyword: String,
    episodeThumb: {
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

module.exports.validate = episode => {
    const schema = Joi.object({
        access: Joi.string().allow(""),
        seasons: Joi.string().required(),
        episodeTitle: Joi.string().required(),
        description: Joi.string().allow(""),
        imdbRating: Joi.string().allow(""),
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
    return schema.validate(episode);
}