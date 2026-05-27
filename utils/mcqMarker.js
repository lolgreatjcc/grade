const { OMRChecker } = require('@armghan3071/omrchecker');
const engine = new OMRChecker();
const { PDFParse } = require('pdf-parse');
const { readFile } = require('node:fs/promises');

const mcqMarker = async (answerSheet, answerKey) => {
    console.log(answerKey.filename);
    // settings for OMR
    const template = {};

    // convert answerKey.pdf into images
    const ansKeyBuffer = process.env.NODE_ENV ? answerKey.buffer 
        // overhead on this local storage implementation
        : await readFile(`mediaUploadTemp/${answerKey.filename}`)
    const ansKeyParser = new PDFParse({'data': ansKeyBuffer});
    const ansKeyResult = await ansKeyParser.getScreenshot({'scale': 1});
    await ansKeyParser.destroy();

    // convert answerSheet.pdf into images
    const ansSheetBuffer = process.env.NODE_ENV ? answerSheet.buffer 
        // overhead on this local storage implementation
        : await readFile(`mediaUploadTemp/${answerSheet.filename}`)
    const ansSheetParser = new PDFParse({'data': ansSheetBuffer});
    const ansSheetResult = await ansSheetParser.getScreenshot({'scale': 1});
    await ansSheetParser.destroy();

    // pull answers from answerKey
    // const answers = engine.process(ansKeyResult.pages, template);
    // console.log(answers);

    // pull answers from answerSheet and grade them by
    // passing answers extracted earlier
    // const result = engine.process(ansSheetResult.pages, template);

    // temporary data to be returned for now
    let returnedResult = ansSheetResult.pages;
    for (let i = 0; i < returnedResult.length; i++) {
        delete returnedResult[i].data;
    }
    return returnedResult;

}

module.exports = mcqMarker;