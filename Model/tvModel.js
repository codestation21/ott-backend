const {Schema, model} = require('mongoose');
const Joi = require('joi');

module.exports.Tv = model('Tv', Schema({
    tvAccess: {
        type: String,
        enum: ["free", "paid"]
    },
    tvCategory: {
        type: Schema.Types.ObjectId,
        ref: 'Tvcategory',
        required: true
    },
    tvName: {
        type: String,
        required: true
    },
    tvLogo: {
        type: String,
        required: true
    },
    description: String,
    status: Boolean,
    httpStreamUrlOne: String,
    httpStreamUrlTwo: String,
    httpStreamUrlThree: String,
    mpegStreamUrlOne: String,
    mpegStreamUrlTwo: String,
    mpegStreamUrlThree: String,
    tvEmbedCode: String,
    youtubeUrl: String,
    seoTitle: String,
    metaDescription: String,
    keyword: String
}, {timestamps: true}));

module.exports.validate = tv => {
    const schema = Joi.object({
        tvAccess: Joi.string().allow(""),
        tvCategory: Joi.string().required(),
        tvName: Joi.string().required(),
        description: Joi.string().allow(""),
        status: Joi.boolean().allow(""),
        httpStreamUrlOne: Joi.string().allow(""),
        httpStreamUrlTwo: Joi.string().allow(""),
        httpStreamUrlThree: Joi.string().allow(""),
        mpegStreamUrlOne: Joi.string().allow(""),
        mpegStreamUrlTwo: Joi.string().allow(),
        mpegStreamUrlThree: Joi.string().allow(""),
        tvEmbedCode: Joi.string().allow(""),
        youtubeUrl: Joi.string().allow(""),
        seoTitle: Joi.string().allow(""),
        metaDescription: Joi.string().allow(""),
        keyword: Joi.string().allow("")
    });
    return schema.validate(tv)
}