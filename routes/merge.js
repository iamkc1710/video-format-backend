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
const ERRORS = {
    PREROLL: 'Please add a preroll video to the preroll folder',
    INPUT: 'Please add an input video to the input folder'
};

router.post('/', authenticateToken, async (req, res) => {
    // Merge already uploaded videos from the input folder with the preroll video from the preroll folder
    let response = await mergeAll();
    console.log(response);
    res.send(response)
});

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

function isNil(obj) {
    return obj === null || typeof obj === 'undefined';
}

function isEmpty(obj) {
    return obj === '' || isNil(obj);
}

function isObject(obj) {
    return obj != null && typeof obj === 'object';
}

function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

function onError(err) {
    if (isObject(err)) {
        console.error(`Error: ${err.message}`, '\n');
    } else {
        console.error(err, '\n');
    }
    process.exitCode = 1;
}

async function merge(prePath, inputPath) {
    try {
        const inputName = path.basename(inputPath);
        ffmpeg(prePath)
            .input(inputPath)
            .on('error', (err) => {
                throw new Error(err);
            })
            .on('start', () => {
                console.log(`Starting merge for ${inputName}`);
            })
            .on('progress', function(progress) {
                console.log('Processing: ' + progress.percent + '% done');
            })
            .on('end', () => {
                console.log(`${inputName} merged!`);
                return `${inputName} merged!`;
            })
            .mergeToFile(path.join(FOLDERS.OUTPUT, inputName), FOLDERS.TEMP)
    } catch (error) {
        onError(error);
        return 'Error in merging';       
    }
}

async function mergeAll() {
    try {
        const prerollFiles = await fs.promises.readdir(FOLDERS.PREROLL);
        if (!isArray(prerollFiles) || prerollFiles.length === 0) {
            throw new Error(ERRORS.PREROLL);
        }

        let preroll;

        for (const p of prerollFiles) {
            const apPath = path.join(FOLDERS.PREROLL, p);
            const stat = await fs.promises.stat(apPath);

            if (!stat.isDirectory()) {
                preroll = apPath;
                break;
            }
        }

        if (isEmpty(preroll)) {
            throw new Error(ERRORS.PREROLL);
        }

        const inputFiles = await fs.promises.readdir(FOLDERS.INPUT);

        if (!isArray(inputFiles) || inputFiles.length === 0) {
            throw new Error(ERRORS.INPUT);
        }

        for (const i of inputFiles) {
            const iPath = path.join(FOLDERS.INPUT, i);
            const stat = await fs.promises.stat(iPath);

            if (!stat.isDirectory()) {
                let response = await merge(preroll, iPath);
                console.log(response);
                return response;
            }
        }
    } catch (e) {
        onError(e);
        return 'An error occurred in merging';
    }
}

module.exports = router;
