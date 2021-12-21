const {Schema, model} = require('mongoose');

module.exports.General = model('General', Schema({
    timeZone: String,
    siteName: String,
    siteLogo: String,
    siteFavicon: String,
    email: String,
    description: String,
    keyword: String,
    headerCode: String,
    footerCode: String,
    copyrightText: String,
    apiKey: String,
    facebook: String,
    twitter: String,
    instagram: String,
    googlePlay: String,
    appStore: String,
    consentTitle: String,
    consentText: String,
    privacyUrl: String,
    envantoUser: String,
    purchaseCode: String
}, {timestamps: true}));