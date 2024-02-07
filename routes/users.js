const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/instaFromScratch");

const plm = require('passport-local-mongoose');

const userSchema = mongoose.Schema({
    username : String,
    email : String,
    password : String,
    picture : String,
    contact : String,
    followers : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    }],
    following : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    }],
    story : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "story"
    }],
    posts : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "posts"
    }],
    saved : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "saved"
    }],
})

userSchema.plugin(plm);

module.exports = mongoose.model("user" ,userSchema);