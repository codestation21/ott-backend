require('dotenv/config');
const mongoose = require('mongoose');
const {graphqlUploadExpress} = require('graphql-upload');
const {join} = require('path')

const app = require('./app');
const apolloServer = require('./apollo');
require('./Helpers/Jobs');


async function startServer() {
    app.use(graphqlUploadExpress());
    await apolloServer.start();
    apolloServer.applyMiddleware({app});
    app.use('/', (req, res) => {
        res.send("Welcome to Super OTT Platform!")
    })
}

startServer();
mongoose.connect(process.env.MONGODB_LOCAL_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => console.log("MongoDB Connected Successfully!"))
    .catch((err) => console.log("MongoDB Connection Failed"));
const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
    console.log(`GraphQl EndPoint path: ${apolloServer.graphqlPath}`);
})

