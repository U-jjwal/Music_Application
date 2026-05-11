import { ImageKit } from "@imagekit/nodejs/client.js";
import dotenv from 'dotenv';

dotenv.config()
const client = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY, // This is the default and can be omitted
});

async function uploadFile(file) {
    const result = await client.files.upload({
        file,
        fileName: "music_" + Date.now(),
        folder:"spotify_backend/music"
    })
    return result;
}

export default uploadFile;