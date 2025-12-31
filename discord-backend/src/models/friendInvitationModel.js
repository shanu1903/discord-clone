const { ref } = require("joi");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const friendInvitationSchema = new Schema({
    senderId : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    receiverId : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    }
})

module.exports = mongoose.model("FrinedInvitation", friendInvitationSchema);;