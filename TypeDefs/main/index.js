const {gql} = require('apollo-server-express');
const userTypeDefs = require("../userDefs");
const genreDefs = require('../genreDefs');
const movieDefs = require('../movieDefs');
const showDefs = require('../showDefs');
const seasonDefs = require('../seasonDefs');
const episodeDefs = require('../episodeDefs');
const sCategoryDefs = require('../sCategoryDefs');
const sportsDefs = require('../sportsDefs');
const tvcategoryDefs = require('../tvcategoryDefs');
const tvDefs = require('../tvDefs');
const sliderDefs = require('../sliderDefs');
const pageDefs = require('../pageDefs');
const generalDefs = require('../generalDefs');
const smtpDefs = require('../smtpDefs');
const lanDefs = require('../lanDefs');
const subscriptionDefs = require('../subscriptionDefs');


const typeDefs = gql`
    scalar Date
    scalar Upload
    type Query {
        _: String
    }
    type Mutation {
        _:String
    }
`;

module.exports = [
    typeDefs,
    userTypeDefs,
    genreDefs,
    movieDefs,
    showDefs,
    seasonDefs,
    episodeDefs,
    sCategoryDefs,
    sportsDefs,
    tvcategoryDefs,
    tvDefs,
    sliderDefs,
    pageDefs,
    generalDefs,
    smtpDefs,
    lanDefs,
    subscriptionDefs
]