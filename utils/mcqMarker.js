const { OMRChecker } = require('@armghan3071/omrchecker');
const engine = new OMRChecker();
const { PDFParse } = require('pdf-parse');
const { readFile } = require('node:fs/promises');
const { writeFile } = require('node:fs/promises');
const { createWorker } = require('tesseract.js');

const mcqMarker = async (answerSheet, answerKey) => {
    // settings for OMR
    const template = {};

    // convert answerKey.pdf into images
    const ansKeyBuffer = process.env.NODE_ENV ? answerKey.buffer 
        // overhead on this local storage implementation
        : await readFile(`mediaUploadTemp/${answerKey.filename}`)
    const ansKeyParser = new PDFParse({'data': ansKeyBuffer});
    const ansKeyResult = await ansKeyParser.getScreenshot({'scale': 2});
    await ansKeyParser.destroy();

    // convert answerSheet.pdf into images
    const ansSheetBuffer = process.env.NODE_ENV ? answerSheet.buffer 
        // overhead on this local storage implementation
        : await readFile(`mediaUploadTemp/${answerSheet.filename}`)
    const ansSheetParser = new PDFParse({'data': ansSheetBuffer});
    const ansSheetResult = await ansSheetParser.getScreenshot({'scale': 2});
    await ansSheetParser.destroy();
    
    //await writeFile('test.png', ansSheetResult.pages[0].data);

    // pull answers from answerKey
    // const answers = engine.process(ansKeyResult.pages, template);
    // console.log(answers);
    const ansKeyImgArr = ansKeyResult.pages;
    for (let i = 0; i < ansKeyImgArr.length; i++) {
        delete ansKeyImgArr[i].data;
    //     const worker = await createWorker('eng');
    //     const ansKeyOCRRes = await worker.recognize(ansKeyImgArr[i].dataUrl);
    //     ansKeyImgArr[i].ocrText = ansKeyOCRRes.data.text;
    //     await worker.terminate();
    }

    


    // pull answers from answerSheet and grade them by
    // passing answers extracted earlier
    // const result = engine.process(ansSheetResult.pages, template);


    // temporary data to be returned for now
    const ansSheetImgArr = ansSheetResult.pages;
    for (let i = 0; i < ansSheetImgArr.length; i++) {
        delete ansSheetImgArr[i].data;
        //const worker = await createWorker('eng');
        //const ansSheetOCRRes = await worker.recognize(ansSheetImgArr[i].dataUrl);
        //ansSheetImgArr[i].ocrText = ansSheetOCRRes.data.text;
        //await worker.terminate();
    }
    return {
        'answerSheet': ansSheetImgArr, 
        'answerSheetFilename': answerSheet.filename,
        'answerKey': ansKeyImgArr,
        'answerKeyFilename': answerKey.filename
    };

}

module.exports = mcqMarker;