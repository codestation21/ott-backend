const {Schema, model} = require('mongoose');
const Joi = require('joi');

module.exports.Subscription = model('Subscription', Schema({
    planName: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    durationType: {
        type: String,
        enum: ["days", "weeks", "months", "years"],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
}, {timestamps: true}));

module.exports.validate = sub => {
    const schema = Joi.object({
        planName: Joi.string().required(),
        duration: Joi.number().required(),
        durationType: Joi.string().valid("days", "weeks", "months", "years").required(),
        price: Joi.number().required(),
        status: Joi.boolean().allow("")
    });
    return schema.validate(sub);
}