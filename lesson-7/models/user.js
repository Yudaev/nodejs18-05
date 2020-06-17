const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const SALT_ROUNDS = 12;

const userSchema = new Schema({
    // id создается автоматически
    email: { type: String, required: true },
    firstname: { type: String },
    lastname: { type: String },
    password: { type: String },
});

userSchema.pre('save', function(next) {
    console.log("this", this);
    if(this.isModified('password')) {
        const salt = bcrypt.genSaltSync(SALT_ROUNDS);
        this.password = bcrypt.hashSync(this.password, salt)
    }

    next();
});

userSchema.methods.validatePassword = function(candidate) {
    return bcrypt.compareSync(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema, 'users');