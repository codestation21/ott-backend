const {Schema, model} = require('mongoose');
const Joi = require('joi');

module.exports.Show = model('Show', Schema({
    language: {
        type: String,
        required: true
    },
    genres: {
        type: Schema.Types.ObjectId,
        required: true
    },
    seasonName: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Season'
        }
    ],
    showName: {
        type: String,
        required: true
    },
    showThumb: {
        type: String,
        required: true
    },
    sortInfo: String,
    imdbRating: String,
    status: Boolean,
    seoTitle: String,
    metaDescription: String,
    keyword: String
}, {timestamps: true}));

module.exports.validate = show => {
    const schema = Joi.object({
        language: Joi.string().required(),
        genres: Joi.string().required(),
        showName: Joi.string().required(),
        sortInfo: Joi.string().allow(""),
        imdbRating: Joi.string().allow(""),
        status: Joi.boolean().allow(""),
        seoTitle: Joi.string().allow(""),
        metaDescription: Joi.string().allow(""),
        keyword: Joi.string().allow("")
    });
    return schema.validate(show);
}