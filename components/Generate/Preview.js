import { useEffect, useRef, useState } from 'react';
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { pdfToImg } from 'pdftoimg-js/browser';
import Image from 'next/image';
import styles from '../../pages/grade/index.module.css'

export default function Preview({numberOfMcqs, numberOfOptions, oecData, previewRef}) {
    const [previewImages, setPreviewImages] = useState([]);
    const [pageIndex, setPageIndex] = useState(0);
    const mcqRef = useRef();
    const [content, setContent] = useState("");
    const options = ["A", "B", "C", "D", "E"];
    const subOption = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
    const roman = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"];
    const lines = [];
    const box = ["w-28 h-16", "w-50 h-30", "w-100 h-70", "w-150 h-100"];
    const columns = 28;
    const rowsPerCol = 10;

    const htmlToPreview = async () => {
        const element = previewRef.current;
        if (!element) return;
        
        const pdf = new jsPDF({
            format: "a4",
            unit: "mm",
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        
        await pdf.html(element, {
            html2canvas: {
                scale: 0.26, // Matches pixels precisely to mm layouts
                useCORS: true, // Enables rendering for cross-origin assets/images
                logging: false
            },
            x: 0,
            y: 0,
            width: pageWidth, 
            windowWidth: 794, 
            autoPaging: 'slice',
        });

        const pdfUrl = pdf.output('datauristring');
        const previewImages = await pdfToImg(pdfUrl, { 'pages': 'all' });
        setPreviewImages(previewImages)     
    }

    const oecPicker = (type, size, questionNumber, subQuestion, subPart) => {
        let returnedString = `<div class="pr-2">Q${questionNumber}${(subQuestion !== undefined) ? 
            `(${subOption[subQuestion]})` : ""}${(subPart !== undefined) ? `(${roman[subPart]})` : ""}</div>`
        if (type == 1) {
            returnedString += `<div class="w-30 h-auto border-b-2 border-black "></div>`;
        } else {
            returnedString += `<div class="${box[size]} border-2 border-black"></div>`;
        }

        return returnedString;

    }

    const renderMcqHeader = (options, length, gridCols, numberOfCols, hideQ) => {
        // set up number of grids
        let tempHeader = `<div class="flex align-center grid ${gridCols} gap-1">`;
        
        for (let col = 0; col < numberOfCols; col++) {
            // show "Q" only on the first column
            if (col === 0 && hideQ !== true) tempHeader += `<h1 class="text-xs col-span-2 text-center">Q</h1>`
            else tempHeader += `<h1 class="text-xs col-span-2 text-center"></h1>`

            // show options in header
            for (let i = 0; i < length; i++) {
                tempHeader += `<div class="flex align-center col-span-1 justify-center"><text class="text-xs text-center">${options[i]}</text></div>`
            }
        }
        tempHeader += "</div>";
        return tempHeader;
    }

    const handlePageNext = () => {
        if (pageIndex + 1 < previewImages.length) setPageIndex(pageIndex + 1);
    }

    const handlePageBack = () => {
        if (pageIndex - 1 >= 0) setPageIndex(pageIndex - 1);
    }
    
    useEffect(() => {
        let tempContent = "";

        // Header of paper
        tempContent += `
        <h1 class="text-sm text-center font-semibold pt-10">NATIONAL UNIVERSITY OF SINGAPORE</h1>
        <span class="text-base font-black text-center block">CS2100 - COMPUTER ORGANISATION</span>
        <h1 class="text-sm text-center">(Semester 1: AY2024/25)</h1>
        <h1 class="text-sm text-center">Time Allowed: 2 Hours</h1>
        `

        // Rendering MCQ
        if (numberOfMcqs > 0 && numberOfOptions > 1) {
            // MCQ Headers
            tempContent += `<div class="w-full border-1 my-4"></div>`;
            tempContent += `<span class="text-base font-black block">Part A: Multiple Choice Questions</span>`
            tempContent += `<text>Please shade using</text> <text class="underline font-black">pencil</text> <text>only once bubble for each question.</text>`
            
            // MCQ box
            tempContent += `<div class='w-full border-1 my-3 pb-3 px-2'>`;
            const gridCols = `grid-cols-${columns}`;
            const requiredCol = Math.ceil(numberOfMcqs / rowsPerCol)
            tempContent += renderMcqHeader(options, numberOfOptions, gridCols, requiredCol);
            for (let i = 0; i < rowsPerCol; i++ ) {
                tempContent += `<div class="flex align-center items-center grid grid-cols-28 gap-1 ${i + 1 == rowsPerCol ? "" : "mb-1"}">`
                for (let col = 0; col < requiredCol; col++) {
                    const questionNumber = i + 1 + col * rowsPerCol;
                    if (questionNumber <= numberOfMcqs) {
                        tempContent += `<h1 class="text-xs col-span-2 text-center align-middle">${questionNumber}</h1>`
                        for (let i = 0; i < numberOfOptions; i++) {
                            tempContent += `<div class="border-1 col-span-1 aspect-square rounded-full self-center"></div>`
                        }
                    }
                    
                }
                tempContent += "</div>";
            }
            tempContent += renderMcqHeader(options, numberOfOptions, gridCols, requiredCol, true);
            tempContent += "</div>";
        }


        if (oecData.length > 0) {
            const numberOfOecs = oecData.length;
            if (numberOfMcqs === 0) tempContent += `<div class="w-full border-1 my-4"></div>`;
            tempContent += `<text class="text-base font-bold block">Part B: Open Ended Questions</text>`
            tempContent += `<text>Write your answers within the boxes provided</text>`
            tempContent += `<div class="min-w-full flex flex-wrap mt-4">`;

            for (let i = 0; i < numberOfOecs; i++) {
                const questionNumber = numberOfMcqs + i + 1;
                const subQuestionLength = oecData[i].subpart.length;
                if (subQuestionLength > 0) {
                    for (let j = 0; j < subQuestionLength; j++) {
                        const subpartLength = oecData[i].subpart[j].subpart.length;
                        if (subpartLength > 0) {
                            for (let k = 0; k < subpartLength; k++) {
                                tempContent += `<div class="flex pb-6 pr-2">`;
                                tempContent += oecPicker(oecData[i].subpart[j].subpart[k].type, oecData[i].subpart[j].subpart[k].size, questionNumber, j, k)
                                tempContent += `</div>`;
                            }
                        } else {
                            tempContent += `<div class="flex pb-6 pr-2">`;
                            tempContent += oecPicker(oecData[i].subpart[j].type, oecData[i].subpart[j].size, questionNumber, j)
                            tempContent += `</div>`;
                        }
                    }
                } else {
                    tempContent += `<div class="flex pb-6 pr-2">`;
                    tempContent += oecPicker(oecData[i].type, oecData[i].size, questionNumber);
                    tempContent += `</div>`;
                }
                
            }
            tempContent += `</div>`;
        }
        
        setContent(tempContent)

    }, [numberOfMcqs, numberOfOptions, oecData])

    useEffect(() => {
        if (content === "" ) return;
        htmlToPreview();
    }, [content])

    return (
        <div className="p-6 flex-1 min-h-0 h-full justify-items-center-safe text-white">
            <h1 className="text-center max-h-1/10" onClick={htmlToPreview}>Preview</h1>
            <div className="max-h-8/10 h-full flex justify-center py-3 relative">
                <div className="bg-white max-h-full h-full aspect-5/7 hidden text-black">
                    <div className="max-h-full h-full text-black p-7" ref={previewRef} dangerouslySetInnerHTML={{ __html: content }}/>
                </div>

                <div className="max-h-full aspect-[1/1.414] text-black relative">
                    <Image className="!relative" alt="img" fill={true} src={(previewImages.length > 0) ? previewImages[pageIndex] : 'https://picsum.photos/200/400'}/>
                </div>

                
            </div>
            <div className="max-h-1/10 flex items-center justify-center">
                <div className={`p-5 ${styles.quizNavigation}`} onClick={handlePageBack}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M640-80 240-480l400-400 71 71-329 329 329 329-71 71Z" /></svg>
                </div>
                <h1 className="text-center">Page {pageIndex + 1} of {previewImages.length}</h1>
                <div className={`p-5 ${styles.quizNavigation}`} onClick={handlePageNext}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" /></svg>
                </div>
            </div>
        </div>
    )
}
