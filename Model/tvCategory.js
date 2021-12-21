const {Schema, model} = require('mongoose');
const Joi = require('joi');

module.exports.Tvcategory = model('Tvcategory', Schema({
    tvCategory: {
        type: String,
        required: true
    },
    tv: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Tv'
        }
    ]
}, {timestamps: true}));

module.exports.validate = tvcategory => {
    const schema = Joi.object({
        tvCategory: Joi.string().required()
    });
    return schema.validate(tvcategory);
}