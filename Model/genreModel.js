const {Schema, model} = require('mongoose');
const Joi = require("joi");

module.exports.Genre = model('Genre', Schema({
    name: {
        type: String,
        required: true
    },
    movies: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Movie'
        }
    ],
    shows: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Show'
        }
    ]
}, {timestamps: true}));

module.exports.validate = genre => {
    const schema = Joi.object({
        name: Joi.string().required().min(3).max(100)
    });
    return schema.validate(genre);
}