const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    media : String,
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "user"
    },
    caption : String,
    likes : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    }],
    comments : {
        type : Array,
        default : [],
    },
    date : {
        type : Date,
        default : Date.now
    },
    shares : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    }]
})


module.exports = mongoose.model("post" ,postSchema);