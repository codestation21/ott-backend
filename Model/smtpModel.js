const {Schema, model} = require('mongoose');

module.exports.Smtp = model('Smtp', Schema({
    host: String,
    port: String,
    email: String,
    password: String
}, {timestamps: true}));
