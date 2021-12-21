const jwt = require('jsonwebtoken');

const {User} = require('../Model/userModel');

module.exports.Token = async(req) => {
    req.user = null;
    let token = req.headers.authorization;
    if(token) {
        token = token.split(" ")[1].trim();
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(decoded) {
            const userInfo = await User.findOne({
                email: decoded.email
            });
            req.user =userInfo;
        }
    }
}