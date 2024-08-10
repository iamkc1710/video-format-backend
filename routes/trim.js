const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const express = require("express");
const {authenticateToken} = require('../services/authentication');
const router = express.Router();
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
const FOLDERS = {
    PREROLL: './preroll',
    INPUT: './files',
    OUTPUT: './output',
    TEMP: './temp'
};

router.post('/', authenticateToken, async (req, res) => {
    const inputPath = req.file.inputPath;
    const trimOffset = req.body.trimOffset;
    let response = await trim(inputPath, trimOffset);
    res.send(response)
});

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);


function isObject(obj) {
    return obj != null && typeof obj === 'object';
}


function onError(err) {
    if (isObject(err)) {
        console.error(`Error: ${err.message}`, '\n');
    } else {
        console.error(err, '\n');
    }
    process.exitCode = 1;
}

async function trim(inputPath, trimOffset) {
    try {
        const inputName = path.basename(inputPath);
        ffmpeg(inputPath)
            .on('error', (err) => {
                throw new Error(err);
            })
            .output('./output/' + inputName)
            .seek(trimOffset)
            .on('end', () => {
                console.log(`${inputName} trimmed!`);
                return `${inputName} trimmed!`;
            })
    } catch (error) {
        onError(error);
        return 'Error in trimming';       
    }
}

module.exports = router;
