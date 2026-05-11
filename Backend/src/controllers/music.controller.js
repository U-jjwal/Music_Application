import { Music } from "../models/music.model.js";
import uploadFile from "../services/storage.service.js";
import { Album } from "../models/album.model.js";
import jwt from "jsonwebtoken";



export const createMusic = async (req, res) => {

    const {title} = req.body;

    const file = req.file

    const result = await uploadFile(file.buffer.toString("base64"));

    const music = await Music.create({
        uri: result.url,
        title,
        artist: req.user.id
    })

    res.status(201).json({
        message: "Music uploaded successfully",
        music: {
            _id: music._id,
            uri: music.uri,
            title: music.title,
            artist: music.artist
        }
    })
    
}

export const createAlbum = async (req, res) => {
    
    
    try {
       

        const {title, musics} = req.body;

        const album = await Album.create({
            title,
            musics,
            artist: req.user.id
        })

        res.status(201).json({
            message: "Album created successfully",
            album: {
                _id: album._id,
                title: album.title,
                musics: album.musics,
                artist: album.artist
            }
        })

    } catch (err) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
    
}

export const getAllMusics = async (req, res) => {

    const musics = await Music.find().populate("artist", "username email")

    res.status(200).json({
        message: "Musics retrieved successfully",
        musics: musics
    })
    
}

export const getAllAlbums = async (req, res) => {

    const albums = await Album.find()
    .limit(10)
    .select("title artist").populate("artist","username email")

    res.status(200).json({
        message: "Albums retrieved successfully",
        albums: albums
    })
    
}

export const getAllAlbumById = async (req, res) => {

    const {albumId} = req.params;

    const album = await Album.findById(albumId).populate("artist", "username email").populate("musics")
    
    res.status(200).json({
        message: "Album retrieved successfully",
        album: album
    })
}