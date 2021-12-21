const {GraphQLDateTime} = require('graphql-iso-date');
const {GraphQLUpload} = require("graphql-upload");
const userResolver = require('../userResolvers');
const genreResolver = require('../genreResolvers');
const movieResolver = require('../movieResolvers');
const showResolver = require('../showResolvers');
const seasonResolver = require('../seasonResolvers');
const episodeResolver = require('../episodResolvers');
const sCategoryResolver = require('../sCategoryResolvers');
const sportsResolver = require('../sportsResolver');
const tvcategoryResolver = require('../tvcategoryResolvers');
const tvResolver = require('../tvResolvers');
const sliderResolver = require('../sliderResolvers');
const pageResolver = require('../pageResolvers');
const generalResolver = require('../generalResolver');
const smtpResolver = require('../smtpResolvers');
const lanResolver = require('../lanResolvers');
const subscriptionResolver = require('../subscriptionResolvers');

const customResolver = {
    Date: GraphQLDateTime,
    Upload: GraphQLUpload
}

module.exports = [
    userResolver,
    genreResolver,
    customResolver,
    movieResolver,
    showResolver,
    seasonResolver,
    episodeResolver,
    sCategoryResolver,
    sportsResolver,
    tvcategoryResolver,
    tvResolver,
    sliderResolver,
    pageResolver,
    generalResolver,
    smtpResolver,
    lanResolver,
    subscriptionResolver
]