'use strict';

const mongoose = require('mongoose');

let RefreshTokenSchema = new mongoose.Schema({
  token: { type: String, default: '' },
});

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);
