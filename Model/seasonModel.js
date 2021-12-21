const {Schema, model} = require('mongoose');
const Joi = require('joi');

module.exports.Season = model('Season', Schema({
    shows: {
        type: Schema.Types.ObjectId,
        ref: 'Show',
        required: true
    },
    episode: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Episode'
        }
    ],
    seasonTitle: {
        type: String,
        required: true
    },
    seasonThumb: {
        type: String,
        required: true
    },
    status: Boolean,
    seoTitle: String,
    metaDescription: String,
    keyword: String
}, {timestamps: true}));
module.exports.validate = season => {
    const schema = Joi.object({
        shows: Joi.string().required(),
        seasonTitle: Joi.string().required(),
        status: Joi.boolean().allow(""),
        seoTitle: Joi.string().allow(""),
        metaDescription: Joi.string().allow(""),
        keyword: Joi.string().allow("")
    });
    return schema.validate(season);
}