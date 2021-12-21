const {Schema, model} = require('mongoose');
const Joi = require('joi');

module.exports.Otp = model('Otp', Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {type: Date, default: Date.now, index: {expires: 300}},
}, {timestamps: true}));

module.exports.validate = user => {
    const schema = Joi.object({
        name: Joi.string().required().min(3).max(25),
        email: Joi.string().email().required(),
        password: Joi.string().required().min(8).max(25)
    });
    return schema.validate(user);
}