const {Jimp} = require('jimp');
const jsQR = require('jsqr');

const scanQr = async (image_base64) => {
    let returnedObj = {'success': false};
    const qrBuffer = Buffer.from(image_base64.replace(/^data:image\/[a-z]+;base64,/, ''), 'base64');

    try {
        const image = await Jimp.read(qrBuffer);
        image.crop({x: 50, y: 50, w: 300, h: 300});

        // for testing to check whether the qr is being cropped properly
        // await image.write("./mediaUploadTemp/test-small1.jpg");

        const width = image.bitmap.width;
        const height = image.bitmap.height;
        const imageData = image.bitmap.data;

        const qrData = jsQR(imageData, width, height);

        if (qrData) {
            const parsedResult = JSON.parse(qrData.data);
            //console.log(parsedResult);
            returnedObj = {...returnedObj, ...parsedResult};
            returnedObj.success = true;
        } else {
            console.log("Qr not found")
        }
    } catch(error) {
        console.error(error || "No QR found")
    }
    
    return returnedObj;
}

module.exports = scanQr;