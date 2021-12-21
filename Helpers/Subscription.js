const moment = require("moment");

module.exports.calculateNextPaymentDate = (durationType, duration, normalDate) => {
    let nextPaymentDate;
    if (durationType === 'years') {
        nextPaymentDate = moment(normalDate);
        nextPaymentDate.add(1, 'hours').format();
        return nextPaymentDate;
    } else if (durationType === 'months') {
        nextPaymentDate = moment(normalDate);
        nextPaymentDate.add(duration, 'months').format();
        return nextPaymentDate;
    } else if (durationType === 'weeks') {
        nextPaymentDate = moment(normalDate);
        nextPaymentDate.add(duration, 'weeks').format();
        return nextPaymentDate;
    } else if (durationType === 'days') {
        nextPaymentDate = moment(normalDate);
        nextPaymentDate.add(duration, 'days').format();
        return nextPaymentDate;
    }
}