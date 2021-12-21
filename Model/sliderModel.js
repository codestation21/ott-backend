const {Schema, model} = require('mongoose');
const Joi = require('joi');

module.exports.Slider = model('Slider', Schema({
    sliderTitle: {
        type: String,
        required: true
    },
    sliderThumb: {
        type: String,
        required: true
    },
    postType: {
        type: String,
        enum: ["Movies", "TV Shows", "Sports", "Live TV"],
        required: true
    },
    postInfo: {
        type: Schema.Types.ObjectId
    }
}, {timestamps: true}));

module.exports.validate = slider => {
    const schema = Joi.object({
        sliderTitle: Joi.string().required(),
        postType: Joi.string().required(),
        postInfo: Joi.string().required()
    });
    return schema.validate(slider);
}