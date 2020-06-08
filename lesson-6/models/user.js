const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    // id создается автоматически
    firstName: String,
    lastName: {
        type: String,
        default: 'Pupkin',
        // validate() {
        //
        // }
    },
    avatar: String,
    email: String,
    bio: String,
});

module.exports = mongoose.model('User', userSchema, 'users');
