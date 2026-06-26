import { useEffect, useRef, useState } from 'react';
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { pdfToImg } from 'pdftoimg-js/browser';
import Image from 'next/image';
import styles from '../../pages/grade/index.module.css'

export default function Preview({numberOfMcqs, numberOfOptions, oeqData, previewRef, institution, subject, year, duration}) {
    const [previewImages, setPreviewImages] = useState([]);
    const [pageIndex, setPageIndex] = useState(0);
    const [maxPage, setMaxPage] = useState(0);
    const mcqRef = useRef();
    const [content, setContent] = useState("");
    const options = ["A", "B", "C", "D", "E", "F", "G"];
    const subOption = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
    const roman = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"];
    const lines = ["w-70 h-32", 'w-70 h-42', 'w-170 h-32', 'w-170 h-42'];
    const box = ["w-24 h-13", "w-50 h-30", "w-100 h-70", "w-170 h-100"];
    const columns = 28;
    const rowsPerCol = 10;

    const htmlToPreview = async () => {
        const element = previewRef.current;
        console.log(typeof element);
        console.log(element)
        if (!element) return;

        // import breaks at the top
        const html2pdf = await import('html2pdf.js'); 

        // PDF options
        const options = {
            'jsPDF': {
                format: "a4",
                unit: "mm",
            },
            'html2canvas': {
                scale: 3, // Increase this to increase resolution
                useCORS: true, // allow images from other origins
                logging: false
            },
            'pagebreak': { 'mode': ['avoid-all', 'css', 'legacy'] }
        }

        // Convert html to pdf datauri. .outputImg exists but only one image
        const pdfUrl = await html2pdf().set(options).from(element).outputPdf('datauristring');

        // convert pdf datauri to imageuri
        const previewImages = await pdfToImg(pdfUrl, { 'pages': 'all' });
        setPreviewImages(previewImages)     
    }

    // pick between lines and boxes for open ended questions
    const oeqPicker = (type, size, questionNumber, subQuestion, subPart) => {
        let returnedString = `<div class="flex pb-6 pr-2">`;

        // render question number
        returnedString += `<div class="pr-2">Q${questionNumber}${(subQuestion !== undefined) ? 
            `(${subOption[subQuestion]})` : ""}${(subPart !== undefined) ? `(${roman[subPart]})` : ""}</div>`
        // type == 1 is lines, size 1 & 3 have extra lines
        if (type == 1) {
            returnedString += `<div class="${lines[size]} border-1 border-black px-2 pb-6">
                                    <div class="w-full h-12 border-b-1 border-dotted p-2"></div>
                                    <div class="w-full h-12 border-b-1 border-dotted p-2"></div>
                                    ${size == 1 || size == 3 ? `<div class="w-full h-12 border-b-1 border-dotted p-2"></div>` : ""}
                                </div>`;
        } else { // type == 2, is box
            returnedString += `<div class="${box[size]} border-1 border-black block break-inside-avoid-page"></div>`;
        }
        returnedString += `</div>`;

        return returnedString;

    }

    // Header above and below mcq boxes (Q A B C D E ...)
    const renderMcqHeader = (options, length, gridCols, numberOfCols, hideQ) => {
        // set up number of grids
        let tempHeader = `<div class="flex align-center grid ${gridCols} gap-1 ${hideQ !== true ? "pb-3" : ""}">`;
        
        for (let col = 0; col < numberOfCols; col++) {
            // show "Q" only on the first column
            if (col === 0 && hideQ !== true) tempHeader += `<h1 class="text-xs col-span-2 text-center">Q</h1>`
            else tempHeader += `<h1 class="text-xs col-span-2 text-center"></h1>`

            // show options (A, B, C, ...) in header
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
        <h1 class="text-sm text-center font-semibold pt-10">${institution}</h1>
        <span class="text-base font-black text-center block">${subject}</span>
        <h1 class="text-sm text-center">${year}</h1>
        <h1 class="text-sm text-center">${duration}</h1>
        `

        // Rendering MCQ
        if (numberOfMcqs > 0 && numberOfOptions > 1) {
            // MCQ Headers
            tempContent += `<div class="w-full border-1 my-4"></div>`;
            tempContent += `<span class="text-base font-black block">Part A: Multiple Choice Questions</span>`
            tempContent += `<text>Please shade using</text> <text class="underline font-black">pencil</text> <text>only once bubble for each question.</text>`
            
            // MCQ box
            tempContent += `<div class='w-full border-1 my-3 pb-3 px-2'>`;
            const gridCols = `grid-cols-${columns}`; //hardcoded to 28 for now
            const requiredCol = Math.ceil(numberOfMcqs / rowsPerCol) // calculate num of sets of columns
            tempContent += renderMcqHeader(options, numberOfOptions, gridCols, requiredCol);
            for (let i = 0; i < rowsPerCol; i++ ) { // for each row (Q1, Q11, Q21, Q31, then Q2, Q12, Q22, Q32, etc)
                tempContent += `<div class="flex align-center items-center grid grid-cols-28 gap-1 ${i + 1 == rowsPerCol ? "" : "mb-1"}">`
                for (let col = 0; col < requiredCol; col++) { // for each set of columns
                    const questionNumber = i + 1 + col * rowsPerCol;
                    if (questionNumber <= numberOfMcqs) { // only render if question exists
                        tempContent += `<h1 class="text-xs col-span-2 text-center align-middle">${questionNumber}</h1>`
                        for (let i = 0; i < numberOfOptions; i++) { // render options (A, B, C, D, ...)
                            tempContent += `<div class="border-1 col-span-1 aspect-square rounded-full self-center"></div>`
                        }
                    }
                    
                }
                tempContent += "</div>";
            }
            // Render (A, B, C, D...) at the bottom, after all the bubbles
            tempContent += renderMcqHeader(options, numberOfOptions, gridCols, requiredCol, true);
            tempContent += "</div>";
        }

        // Open Ended
        if (oeqData.length > 0) {
            const numberOfQuestions = oeqData.length;
            
            // if there are no MCQs, render divider between header and Open Ended
            if (numberOfMcqs === 0) tempContent += `<div class="w-full border-1 my-4"></div>`;
            tempContent += `<text class="text-base font-bold block">Part B: Open Ended Questions</text>`
            tempContent += `<h1 class="pb-1">Write your answers within the boxes provided</h1>`

            for (let i = 0; i < numberOfQuestions; i++) { // For each question
                const questionNumber = numberOfMcqs + i + 1;
                const subQuestionLength = oeqData[i].subpart.length; // Check if sub question exist (a, b, c, ...)

                // putting questions with the same main question number together for auto paging
                tempContent += `<div class="block"><div class="flex flex-wrap">`
                if (subQuestionLength > 0) { // if subQuestions exists
                    for (let j = 0; j < subQuestionLength; j++) {
                        const subpartLength = oeqData[i].subpart[j].subpart.length; // Check if sub parts exist
                        if (subpartLength > 0) { // if there are sub parts (i, ii, iii, ...)
                            for (let k = 0; k < subpartLength; k++) { 
                                // rendering for sub part (i, ii, iii, ...)
                                tempContent += oeqPicker(oeqData[i].subpart[j].subpart[k].type, oeqData[i].subpart[j].subpart[k].size, questionNumber, j, k);
                            }
                        } else {
                            // rendering for sub question (a, b, c, ...)
                            tempContent += oeqPicker(oeqData[i].subpart[j].type, oeqData[i].subpart[j].size, questionNumber, j);
                        }
                    }
                } else {
                    // rendering for main question
                    tempContent += oeqPicker(oeqData[i].type, oeqData[i].size, questionNumber);
                }
                tempContent += `</div></div>`
                
            }
        }
        // setting content to be generated
        setContent(tempContent)

    }, [numberOfMcqs, numberOfOptions, oeqData, institution, subject, year, duration])

    // render preview upon content update (Headers, MCQ, Open Ended)
    useEffect(() => {
        if (content === "") return;
        htmlToPreview();
    }, [content])

    // Update max page on preview update
    useEffect(() => {
        setMaxPage(previewImages.length);
    }, [previewImages])

    // Change current page if current page is bigger than max page
    useEffect(() => {
        if (maxPage === 0) return;
        if (pageIndex + 1 > maxPage) setPageIndex(maxPage - 1);
    }, [maxPage])

    return (
        <div className="flex-1 min-h-0 h-full justify-items-center-safe text-white">
            <h1 className="text-center max-h-1/12" onClick={htmlToPreview}>Preview</h1>
            <div className="max-h-10/12 h-full flex justify-center relative">
                <div className="bg-white max-h-full h-full aspect-5/7 hidden text-black">
                    <div className="max-h-full h-full text-black p-7" ref={previewRef} dangerouslySetInnerHTML={{ __html: content }}/>
                </div>

                <div className="max-h-full aspect-[1/1.414] text-black relative">
                    <Image className="!relative" alt="img" fill={true} src={(previewImages.length > 0) ? previewImages[pageIndex] : 'https://picsum.photos/200/400'}/>
                </div>

                
            </div>
            <div className="max-h-1/12 flex items-center justify-center">
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
