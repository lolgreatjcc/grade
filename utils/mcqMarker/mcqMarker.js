const { PDFParse } = require('pdf-parse');
const { readFile } = require('node:fs/promises');
const { writeFile } = require('node:fs/promises');
const path = require('path');
const { createWorker } = require('tesseract.js');
const { Worker } = require('worker_threads');
const scanQr = require('../scanQr.js');

const mcqMarker = async (answerSheet, answerKey, questionPaper) => {

    // convert answerKey.pdf into images
    // const ansKeyBuffer = answerKey.buffer;
    // const ansKeyParser = new PDFParse({'data': ansKeyBuffer});
    // const ansKeyResult = await ansKeyParser.getScreenshot({'scale': 2});
    // await ansKeyParser.destroy();

    // convert answerSheet.pdf into images
    const ansSheetBuffer = answerSheet.buffer;
    const ansSheetParser = new PDFParse({'data': ansSheetBuffer});
    const ansSheetResult = await ansSheetParser.getScreenshot({'scale': 2.5});
    await ansSheetParser.destroy();

    const ansSheetImgArr = ansSheetResult.pages;
    for (let i = 0; i < ansSheetImgArr.length; i++) {
        delete ansSheetImgArr[i].data;
    }

    let questionPaperImgArr;
    if (questionPaper) {
        const questionPaperBuffer = questionPaper.buffer;
        const questionPaperParser = new PDFParse({'data': questionPaperBuffer});
        const questionPaperResult = await questionPaperParser.getScreenshot({'scale': 2.5});
        await questionPaperParser.destroy();

        questionPaperImgArr = questionPaperResult.pages;
        for (let i = 0; i < questionPaperImgArr.length; i++) {
            delete questionPaperImgArr[i].data;
        }
    } 

    const qrData = await scanQr(ansSheetImgArr[0].dataUrl);

    return {
        'answerSheet': questionPaper ? questionPaperImgArr : ansSheetImgArr,
        'answerSheetFilename': answerSheet.filename,
        'answerKeyFilename': answerKey.filename,
        'qrData': qrData
    };

}

module.exports = mcqMarker;