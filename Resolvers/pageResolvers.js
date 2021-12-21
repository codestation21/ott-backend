const {combineResolvers} = require('graphql-resolvers');

const {Page, validate} = require('../Model/PageModel');
const {isAuthenticated} = require('../Middlewares/Authorize');
const {isAdmin} = require('../Middlewares/Admin');


module.exports = {
    Query: {
        getPageList: async () => {
            const page = await Page.find();
            if (page.length === 0) throw new Error("Page list is empty!");
            return page;
        },
        getPageById: async (_, {id}) => {
            const page = await Page.findOne({
                _id: id
            });
            if (!page) throw new Error("Page not found!");
            return page;
        }
    },
    Mutation: {
        addPage: combineResolvers(isAuthenticated, isAdmin, async (_, {input}) => {
            const havePage = await Page.find();
            if (havePage.length === 5) throw new Error("You can't add more than 5 pages!");
            const {error} = validate(input);
            if (error) throw new Error(error.details[0].message);
            const page = new Page({...input});
            const result = await page.save();
            return {
                message: "Page added successfully!",
                id: result._id,
                pageTitle: result.pageTitle,
                status: result.status
            }
        }),
        updatePage: combineResolvers(isAuthenticated, isAdmin, async (_, {id, input}) => {
            const page = await Page.findByIdAndUpdate(id, {...input}, {new: true});
            if (!page) throw new Error("Page not found!");
            return {
                message: "Page updated successfully!",
                id: page._id,
                pageTitle: page.pageTitle,
                status: page.status
            }
        }),
        deletePage: combineResolvers(isAuthenticated, isAdmin, async (_, {id}) => {
            const page = await Page.findByIdAndDelete(id);
            if (!page) throw new Error("Page not found!");
            return {
                message: "Page Deleted Successfully!",
                pageTitle: page.pageTitle
            }
        })
    }
}