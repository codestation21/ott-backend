const {Schema, model} = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = Schema({
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
    },
    phone: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    nextPaymentDate: Date,
    role: {
        type: String,
        enum: ["admin", "user", "sub-admin"],
        default: "user"
    }
}, {timestamps: true});

userSchema.methods.generateJWT = function () {
    const token = jwt.sign({
        email: this.email
    }, process.env.JWT_SECRET_KEY, {expiresIn: "90d"});
    return token;
}

module.exports.User = model('User', userSchema);