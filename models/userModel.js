const crypto = require('crypto');
const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: [ true, 'Please enter a name']
    },
    email: {
        type: String,
        required: [ true, 'Please provide an email address'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [ validator.isEmail, 'Please enter a valid email']
    },
    photo: {
        type: String,

    },

    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },

    password: {
        type: String,
        required: [ true, 'Please provide a password'],
        minlength: 8,
        select: false      // will not show up in any display or search
    },
    passwordConfirm: {
        type: String,
        required: [ true, 'please confirm your password'],
        validate: {
            // This only works on CREATE and SAVE!!!!!
            validator: function (el) {
                return el === this.password;
            },
            message: 'Password must be the same.',
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
})

userSchema.pre('save', async function(next) {
    // only run this function if password is actually modified
    const user = this;
    if (!user.isModified('password')) return next(); 
    this.password = await bcrypt.hash(this.password, 12) // hash with cost 12
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password') || this.isNew ) return next();
    this.passwordChangedAt = Date.now() - 1000; // allow time for database to save
    next();
});

// An instance method
userSchema.methods.correctPassword = async function(
    candidatePassword, 
    userPassword
    ){
    return await bcrypt.compare(candidatePassword, userPassword);
}

//Below: cannot use async function
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    // if(this.userSchema.changedPasswordAt) {
    // if(this.userSchema.passwordChangedAt) {
    if(this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime()/1000, 10
            );

        // console.log(this.passwordChangedAt, JWTTimestamp);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
}

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    console.log({resetToken}, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const user = mongoose.model('User', userSchema);
module.exports = user;
