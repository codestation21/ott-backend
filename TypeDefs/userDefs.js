const {gql} = require('apollo-server-express');


module.exports = gql`
    extend type Query {
        getUserlist: [User]
        getUserById(id: ID!): User
        getSubAdminList: [User]
    }
    extend type Mutation {
        signup(input: singnupInput): Message
        verifyotp(input: verifyInput): UserInfo
        login(input: loginInput): Token
        userSubscription(id: ID): subcriptionModel
        updateProfile(input: updateInput, file: Upload): UpdateInfo
        updatePassword(input: passwordInput): PasswordUpdateInfo
        makeSubAdmin(id: ID!): SubAdminInfo
        deleteSubAdmin(id: ID!): DeleteSubInfo
        deleteProfile(id: ID!): DeleteInfo
    }
    input singnupInput {
        name: String
        email: String
        password: String
    }
    input updateInput {
        name: String
        phone: String
    }
    input verifyInput {
        email: String
        otp: String
    }
    input passwordInput {
        oldPassword: String
        newPassword: String
    }
    input loginInput {
        email: String
        password: String
    }
    type subcriptionModel {
        message: String
    }
    type DeleteSubInfo {
        message: String
    }
    type PasswordUpdateInfo {
        message: String
    }
    type DeleteInfo{
        message: String
        email: String
    }
    type UpdateInfo {
        message: String
        name: String
        phone: String
        avatar: String
    }
    type SubAdminInfo {
        message: String
        id: ID!
        name: String
        email: String
        avatar: String
        phone: String
        role: String
        createdAt: Date
        updatedAt: Date
    }
    type Token {
        message: String
        token: String
        isPaid: Boolean
    }
    type Message {
        message: String
        email: String
    }
    type User {
        id: ID!
        name: String
        email: String
        avatar: String
        phone: String
        role: String
        createdAt: Date
        updatedAt: Date
    }
    type UserInfo {
        message: String
        id: ID
        name: String
        email: String
        isPaid: Boolean
        token: String
    }
`;