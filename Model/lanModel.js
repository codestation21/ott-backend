const {Schema, model} = require('mongoose');
const Joi = require('joi');

module.exports.Language = model('Language', Schema({
    language: {
        type: String,
        required: true
    },
    lanThumb: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
}, {timestamps: true}));


module.exports.validate = lan => {
    const schema = Joi.object({
        language: Joi.string().required(),
        status: Joi.boolean().allow("")
    });
    return schema.validate(lan)
}