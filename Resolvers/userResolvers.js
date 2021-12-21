const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const {combineResolvers} = require('graphql-resolvers');
const {createWriteStream} = require('fs');
const fs = require('fs');
const {join, parse} = require('path');
const moment = require('moment');
const {UserInputError, ForbiddenError, AuthenticationError} = require('apollo-server-express')

const {User} = require('../Model/userModel');
const {Otp, validate} = require('../Model/otpModel');
const {Smtp} = require('../Model/smtpModel');
const {Subscription} = require('../Model/subscriptionModel');
const {calculateNextPaymentDate} = require('../Helpers/Subscription');
const {isAuthenticated} = require("../Middlewares/Authorize");
const {isAdmin} = require("../Middlewares/Admin");
const {isMainAdmin} = require('../Middlewares/mainAdmin');

module.exports = {
    Query: {
        getUserlist: combineResolvers(isAuthenticated, isAdmin, async () => {
            const user = await User.find({
                role: "user"
            });
            if (user.length === 0) throw new Error("No user found");
            return user;
        }),
        getUserById: combineResolvers(isAuthenticated, isAdmin, async (_, {id}) => {
            const user = await User.findOne({
                _id: id,
                role: "user"
            });
            if (!user) throw new Error("User not found!");
            return user
        }),
        getSubAdminList: combineResolvers(isAuthenticated, isAdmin, async () => {
            const admin = await User.find({
                role: "sub-admin"
            });
            if (!admin) throw new Error("No sub admin found");
            return admin;
        })
    },
    Mutation: {
        signup: async (_, {input}) => {
            const user = await User.findOne({
                email: input.email
            });
            if (user) throw new Error("User already exist!");
            const {error} = validate(input);
            if (error) throw new UserInputError(error.details[0].message);
            const OTP = otpGenerator.generate(6, {
                digits: true,
                alphabets: false,
                upperCase: false,
                specialChars: false
            });
            const smtp = await Smtp.findOne();
            let testAccount = await nodemailer.createTestAccount();
            let transporter = nodemailer.createTransport({
                host: `${smtp.host}`,
                port: smtp.port,
                secure: true,
                auth: {
                    user: `${smtp.email}`,
                    pass: `${smtp.password}`,
                },
            });
            let info = await transporter.sendMail({
                from: 'info@siamahnaf.com',
                to: input.email,
                subject: "OTP Verification",
                text: `Your OTP Verification Code. Please do not share the otp. The otp is  ${OTP}`,
            });
            const otp = new Otp({...input, otp: OTP});
            otp.otp = await bcrypt.hash(otp.otp, 12);
            otp.password = await bcrypt.hash(otp.password, 12);
            const result = await otp.save();
            return {message: "Please check your email for otp!", email: result.email};
        },
        verifyotp: async (_, {input}) => {
            const otpHolder = await Otp.find({
                email: input.email
            });
            if (otpHolder.length === 0) throw new Error("You use an expired otp!");
            const lastOtp = otpHolder[otpHolder.length - 1];
            const validRequest = await bcrypt.compare(input.otp, lastOtp.otp);
            if (lastOtp.email === input.email && validRequest) {
                const user = new User({name: lastOtp.name, email: input.email, password: lastOtp.password});
                const token = user.generateJWT();
                const result = await user.save();
                await Otp.deleteMany({
                    email: lastOtp.email
                });
                return {
                    message: "User Registration Successfull!",
                    id: result._id,
                    name: result.name,
                    email: result.email,
                    isPaid: result.isPaid,
                    token: token
                }
            } else {
                throw new Error("The otp was wrong!")
            }
        },
        login: async (_, {input}) => {
            const user = await User.findOne({
                email: input.email
            });
            if (!user) throw new Error("Wrong email or password!");
            const validUser = await bcrypt.compare(input.password, user.password);
            if (!validUser) throw new Error("Wrong email or password!");
            const token = user.generateJWT();
            return {
                message: "Login successful!",
                token: token,
                isPaid: user.isPaid
            }
        },
        userSubscription: combineResolvers(isAuthenticated, async (_, {id}, {requestedUserInfo}) => {
            const subscription = await Subscription.findOne({
                _id: id
            });
            if (!subscription) throw new Error("Please select a valid subscription plan!");
            const currentDate = Date.now();
            let nextPaymentDate = calculateNextPaymentDate(subscription.durationType, subscription.duration, currentDate);
            const user = await User.findOne({
                _id: requestedUserInfo._id
            });
            if (!user.nextPaymentDate) {
                user.isPaid = true;
                user.nextPaymentDate = nextPaymentDate;
                await user.save();
            } else {
                const isHaveSubscription = moment(user.nextPaymentDate);
                const restDate = isHaveSubscription.diff(Date.now());
                nextPaymentDate = nextPaymentDate.add(restDate);
                user.nextPaymentDate = nextPaymentDate;
                await user.save();
            }
            return {
                message: "You subscription super ott"
            }
        }),
        updateProfile: combineResolvers(isAuthenticated, async (_, {input, file}, {requestedUserInfo}) => {
            let result = await User.findOne({
                _id: requestedUserInfo._id,
                email: requestedUserInfo.email
            });
            if (!result) throw new Error("User not found!");
            const fileUp = await file
            if (fileUp && result.avatar) {
                const deleteAvatar = result.avatar.split('Image')[1].replace(/\\/g, "");
                fs.unlinkSync(join(__dirname, `../Upload/Image/${deleteAvatar}`));
            }
            if (fileUp) {
                let {filename, createReadStream} = fileUp;
                let stream = createReadStream();
                let {ext, name} = parse(filename);
                name = `suparott${Math.floor((Math.random() * 10000) + 1)}`;
                let serverFile = join(__dirname, `../Upload/Image/${name}-${Date.now()}${ext}`);
                let writeStream = await createWriteStream(serverFile);
                await stream.pipe(writeStream);
                const baseUrl = process.env.BASE_URL
                const port = process.env.PORT
                serverFile = `${baseUrl}${port}${serverFile.split('Upload')[1]}`
                const result = await User.findByIdAndUpdate(requestedUserInfo._id, {
                    ...input,
                    avatar: serverFile
                }, {new: true});
                return {
                    message: "Profile updated successfully!",
                    name: result.name,
                    phone: result.phone,
                    avatar: result.avatar
                };
            } else {
                const result = await User.findByIdAndUpdate(requestedUserInfo._id, {
                    ...input
                }, {new: true});
                console.log(result);
                return {
                    message: "Profile updated successfully!",
                    name: result.name,
                    phone: result.phone,
                    avatar: result.avatar
                };
            }

        }),
        deleteProfile: combineResolvers(isAuthenticated, isAdmin, async (_, {id}) => {
            const result = await User.findOneAndDelete({
                _id: id,
                role: "user"
            });
            if (!result) throw new Error("User can't be deleted!");
            if (result.avatar) {
                const deleteAvatar = result.avatar.split('Image')[1].replace(/\\/g, "");
                fs.unlinkSync(join(__dirname, `../Upload/Image/${deleteAvatar}`));
            }
            return {
                message: "Profile Deleted Successfull!",
                email: result.email
            }
        }),
        updatePassword: combineResolvers(isAuthenticated, async (_, {input}, {requestedUserInfo}) => {
            const user = await User.findOne({
                _id: requestedUserInfo._id
            });
            const validUser = await bcrypt.compare(input.oldPassword, user.password);
            if (!validUser) throw new Error("Your password was wrong!");
            const hashedPassword = await bcrypt.hash(input.newPassword, 12);
            user.password = hashedPassword;
            await user.save();
            return {message: "Password updated Successful!"}
        }),
        makeSubAdmin: combineResolvers(isAuthenticated, isMainAdmin, async (_, {id}) => {
            const user = await User.findOne({
                _id: id,
                role: "user"
            });
            if (!user) throw new Error("User not found!");
            user.role = "sub-admin";
            const result = await user.save();
            console.log(result);
            return {
                message: "Sub Admin creation Successful!",
                id: result._id,
                name: result.name,
                email: result.email,
                avatar: result.avatar,
                phone: result.phone,
                role: result.role,
                createdAt: result.createdAt,
                updatedAt: result.updatedAt
            }
        }),
        deleteSubAdmin: combineResolvers(isAuthenticated, isMainAdmin, async (_, {id}) => {
            const subAdmin = await User.findOne({
                _id: id,
                role: "sub-admin"
            });
            if (!subAdmin) throw new Error("Sub Admin not found");
            subAdmin.role = "user"
            await subAdmin.save();
            return {
                message: "Sub Admin Deleted successfully!"
            }
        })
    }
}
