const {ApolloServer} = require("apollo-server-express");
const Dataloader = require('dataloader');
const resolvers = require('./Resolvers/main');
const typeDefs = require('./TypeDefs/main');
const loaders = require('./Loaders/main');
const {Token} = require('./Middlewares/Token');


const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({req}) => {
        await Token(req);
        return {
            requestedUserInfo: req.user,
            loaders: {
                genres: new Dataloader(keys => loaders.genreLoaders.batchGenre(keys)),
                shows: new Dataloader(keys => loaders.showLoaders.batchShow(keys)),
                seasons: new Dataloader(keys => loaders.seasonLoaders.batchSeason(keys)),
                scategory: new Dataloader(keys => loaders.scategoryLoaders.batchScategory(keys)),
                tvcategory: new Dataloader(keys => loaders.tvcategoryLoaders.batchTvcategory(keys)),
                movies: new Dataloader(keys => loaders.movieLoaders.batchMovie(keys)),
                sports: new Dataloader(keys => loaders.sportLoaders.batchSports(keys)),
                tvs: new Dataloader(keys => loaders.tvLoaders.batchTv(keys))
            }
        }
    },
    formatError: (err) => {
        return err;
    }
})
module.exports = apolloServer