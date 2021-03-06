const mongoose = require('mongoose');
const crypto = require('crypto');
const uuidv1 = require('uuidv1');

const UserSchema = new mongoose.Schema(
    {
        fname: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        mname: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        lname: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        uname: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true
        },
        hashed_password: {
            type: String,
            required: true
        },
        salt: String,
        role: {
            type: Number,
            default: 0
        },
    },
);

// virtual field
UserSchema
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = uuidv1();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

UserSchema.methods = {
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    encryptPassword: function(password) {
        if (!password) return '';
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            return '';
        }
    }
};

module.exports = mongoose.model('User', UserSchema);
