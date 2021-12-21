const {Schema, model} = require('mongoose');
const Joi = require('joi');

module.exports.Page = model('Page', Schema({
    pageTitle: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
}, {timestamps: true}));

module.exports.validate = page => {
    const schema = Joi.object({
        pageTitle: Joi.string().required(),
        description: Joi.string().required(),
        status: Joi.boolean().allow("")
    });
    return schema.validate(page)
}