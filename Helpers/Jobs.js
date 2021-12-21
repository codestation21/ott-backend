const cron = require('node-cron');
const moment = require('moment');

const {User} = require('../Model/userModel');
const {Otp} = require('../Model/otpModel');

cron.schedule('* 1 * * *', async () => {
    let today_date = moment(Date.now()).format("YYYY-MM-DD hh:mm");
    const find_users = await User.find();
    if (find_users) {
        for (let i = 0; i < find_users.length; i++) {
            let users = find_users[i];
            let userDueDate = moment(users.nextPaymentDate).format("YYYY-MM-DD hh:mm");
            if (today_date === userDueDate) {
                let find_user = await User.findById(users._id);
                find_user.isPaid = false;
                find_user.nextPaymentDate = null;
                await find_user.save();
            }
        }
    }
})

