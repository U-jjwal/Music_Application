import mongoose from 'mongoose';

const musicSchema = new mongoose.Schema({
    uri: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true})



export const Music = mongoose.model('Music', musicSchema);