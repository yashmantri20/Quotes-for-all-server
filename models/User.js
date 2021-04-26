const { model, Schema } = require('mongoose');

//create schema 
const userSchema = new Schema({
    username: String,
    email: String,
    password: String,
    createdAt: String,
    followers: [{
        username: String
    }],
    following: [{
        username: String
    }],
    // post:[{
    //     type: Schema.Types.ObjectId,
    //     ref: "posts"
    // }]
});

module.exports = model('User', userSchema);