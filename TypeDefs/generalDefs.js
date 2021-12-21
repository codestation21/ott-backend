const {gql} = require('apollo-server-express');

module.exports = gql`
    extend type Query {
        generalSettings: Generals
    }
    extend type Mutation {
        addGeneral(siteLogo: Upload, siteIcon: Upload, input: generalInput): generalInfoMessage
    }
    input generalInput {
        timeZone: String
        siteName: String
        email: String
        description: String
        keyword: String
        headerCode: String
        footerCode: String
        copyrightText: String
        apiKey: String
        facebook: String
        twitter: String
        instagram: String
        googlePlay: String
        appStore: String
        consentTitle: String
        consentText: String
        privacyUrl: String
        envantoUser: String
        purchaseCode: String
    }
    type Generals {
        id: String
        timeZone: String
        siteName: String
        siteLogo: String
        siteFavicon: String
        email: String
        description: String
        keyword: String
        headerCode: String
        footerCode: String
        copyrightText: String
        apiKey: String
        facebook: String
        twitter: String
        instagram: String
        googlePlay: String
        appStore: String
        consentTitle: String
        consentText: String
        privacyUrl: String
        envantoUser: String
        purchaseCode: String
        createdAt: Date
        updatedAt: Date
    }
    type generalInfoMessage {
        message: String
    }
`;