const {Schema, model} = require('mongoose');
const Joi = require('joi');

module.exports.Scategory = model('Scategory', Schema({
    sportCategory: {
        type: String,
        required: true
    },
    sports: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Sports'
        }
    ]
}, {timestamps: true}));

module.exports.validate = scategory => {
    const schema = Joi.object({
        sportCategory: Joi.string().required()
    });
    return schema.validate(scategory);
}