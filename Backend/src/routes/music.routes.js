import express from 'express';
import { createAlbum, createMusic, getAllAlbumById, getAllAlbums, getAllMusics } from '../controllers/music.controller.js';
import multer from 'multer';
import { authArtist, authUser } from '../middlewares/auth.middleware.js';
const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage()
});

router.route('/upload').post(authArtist,upload.single('music'), createMusic);
router.route('/album').post(authArtist, createAlbum)

router.route('/').get(authUser,getAllMusics)
router.route('/albums').get(authUser, getAllAlbums)
router.route('/albums/:albumId').get(authUser, getAllAlbumById)

export default router;