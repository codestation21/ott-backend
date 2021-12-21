const {combineResolvers} = require('graphql-resolvers');

const {Smtp} = require('../Model/smtpModel');
const {isAuthenticated} = require('../Middlewares/Authorize');
const {isAdmin} = require('../Middlewares/Admin');


module.exports = {
    Query: {
        getSmtp: combineResolvers(isAuthenticated, isAdmin, async () => {
            const smtps = await Smtp.findOne();
            if (!smtps) throw new Error("Please set Smtps first!");
            return smtps;
        })
    },
    Mutation: {
        updateSmtp: combineResolvers(isAuthenticated, isAdmin, async (_, {input}) => {
            const smtp = await Smtp.findOne();
            if (smtp) {
                const smtps = await Smtp.findByIdAndUpdate(smtp._id, {...input}, {new: true});
                return {
                    message: "SMTP is updated successfully!"
                }
            } else {
                const smtps = new Smtp({...input});
                const result = await smtps.save();
                return {
                    message: "SMTP is set successfully!"
                }
            }
        })
    }
}