import Logo from "@/components/Logo";
import styles from './index.module.css';
import React, { useEffect, useRef, useState } from "react";
import Menu from "@/components/Menu/Menu";
import { OMRChecker } from '@armghan3071/omrchecker';
import AnswerSheetButton from '../../components/Omr/AnswerSheetButton';
import { pdfToImg } from "pdftoimg-js/browser";
import omr_template from "../../components/Omr/omr_template";

export default function Generate() {
    // Stores the answerSheet file and answerKey file.
    // The format for the file obj stems from JS Web API. See: https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications
    const [testFile, setTestFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [fileObj, setFileObj] = useState(null);

    // Handles what happens when user uploads files.
    // i.e file validation, converts to image, saves file into React State.
    const handleFile = async (event, setFileState, setPreviewImage) => {
        const file = event.target.files[0];
        if (file) {
        const fileSize = file.size;
        if (fileSize > 5242880) {
            console.log("file too big")
            return false;
        } else {
            const previewImage = await pdfToImg(URL.createObjectURL(file), { 'pages': 'firstPage' });
            setPreviewImage(previewImage);
            setFileState(file);

            const image = previewImage.split(',')[1];
            const binaryString = atob(image);
            let binaryArrayIndex = binaryString.length;
            const uInt8Array = new Uint8Array(binaryArrayIndex);

            while (binaryArrayIndex--) {
              uInt8Array[binaryArrayIndex] = binaryString.charCodeAt(binaryArrayIndex);
            }

            const convertedFile = new File([uInt8Array], 'image.jpg', { 'type': 'image/jpeg' });      
            setFileObj(convertedFile);
            return true;
        }
        } else {
        setPreviewImage(null);
        return null;
        }
    }

    useEffect(() => {
        if (fileObj === null) return;
        console.log(fileObj);
        const omr = async () => {
            const engine = new OMRChecker();
            // Load Template & Marker
            const marker = await fetch('./omr_marker.jpg').then(res => res.blob());
            const results = await engine.process([fileObj], omr_template.four, marker);
            console.log(results);
            // const resultImage = results[0].layoutImage;
            // const base64Data = resultImage.replace(/^data:.+;base64,/, '');
            // const byteCharacters = atob(base64Data); // Decode Base64 string
            // const byteNumbers = new Array(byteCharacters.length);

            // for (let i = 0; i < byteCharacters.length; i++) {
            //     byteNumbers[i] = byteCharacters.charCodeAt(i);
            // }

            // const byteArray = new Uint8Array(byteNumbers);
            // const blob = new Blob([byteArray], { 'type': 'image/jpeg' });
            // const url = URL.createObjectURL(blob);

            // // Create a link element to download the file
            // const link = document.createElement('a');
            // link.href = url;
            // link.download = "test.jpg";
            // link.click();

            // // Cleanup
            // URL.revokeObjectURL(url);
        }
        
        omr();
    }, [fileObj])
 

    return (
        <div className="h-screen w-screen">
            <div className={'h-full flex flex-col'}>
                <div className="ml-10 w-min max-h-min"><Logo /></div>
                <div className="absolute right-5 top-5">
                    <Menu/>
                </div>
                <AnswerSheetButton 
                    setAnswerSheet={setTestFile} 
                    handleFile={handleFile} 
                    previewImage={previewImage} 
                    setPreviewImage={setPreviewImage} 
                />
                </div>  
        </div>
    );

}
