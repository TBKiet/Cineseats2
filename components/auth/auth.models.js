const mongoose = require('mongoose');
const crypto = require('crypto');
const userDBConnection = require('../../config/userDBConnection');
const schema = mongoose.Schema;

const userSchema = new schema({
    username: String,
    email: String,
    password: String,
    role: {
        type: String,
        default: 'user'
    },
    isActive: {type: Boolean, default: false},
    activationToken: {type: String},
    activationExpires: {type: Date} // Expiry time

});

userSchema.methods.getVerificationToken = function () {
    const token = crypto.randomBytes(32).toString('hex');
    this.activationToken = crypto.createHash('sha256').update(token).digest('hex');
    this.activationExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    return token;
}
const userModel = userDBConnection.model('user', userSchema);
module.exports = userModel;