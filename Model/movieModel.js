const {Schema, model} = require('mongoose');
const Joi = require('joi');

module.exports.Movie = model('Movie', Schema({
    movieAccess: {
        type: String,
        enum: ["paid", 'free'],
        required: true
    },
    language: {
        type: String,
        required: true
    },
    genres: {
        type: Schema.Types.ObjectId,
        ref: 'Genre',
        required: true
    },
    movieName: {
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
    movieThumbnail: {
        type: String,
        required: true
    },
    localVideo: String,
    urlVideo: String,
    embedCode: String,
    hlsVideo: String,
    mpegVideo: String,
    downloadUrl: String,
    subtitle: String,
}, {timestamps: true}));

module.exports.validate = movie => {
    const schema = Joi.object({
        movieAccess: Joi.string().required(),
        language: Joi.string().required(),
        genres: Joi.string().required(),
        movieName: Joi.string().required(),
        description: Joi.string().allow(""),
        imdbRating: Joi.string().allow(""),
        releaseDate: Joi.string().allow(""),
        duration: Joi.string().allow(""),
        status: Joi.boolean().allow(""),
        seoTitle: Joi.string().allow(""),
        metaDescription: Joi.string().allow(""),
        keyword: Joi.string().allow(""),
        urlVideo: Joi.string().allow(""),
        embedCode: Joi.string().allow(""),
        hlsVideo: Joi.string().allow(""),
        mpegVideo: Joi.string().allow(""),
        downloadUrl: Joi.string().allow(""),
        subtitle: Joi.string().allow(""),
    });
    return schema.validate(movie);
}
