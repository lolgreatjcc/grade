const puppeteer = require('puppeteer');

// MCQ rows and columns
const columns = 28;
const rowsPerCol = 10;
const options = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

const genAnsSheet = {
    // Header above and below mcq boxes (Q A B C D E ...)
    renderMcqHeader: (options, length, gridCols, numberOfCols, hideQ) => {
        // set up number of grids
        let tempHeader = `<div class="flex align-center grid ${gridCols} gap-1 py-2">`;
        
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
    },
    htmlToImg: async (html, fileName, returnAsBuffer) => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' })
        const shadedAnswerBuffer = await page.screenshot({
            'path': returnAsBuffer ? undefined : './mediaUploadTemp/' + fileName,
            'fullPage': true,
        })
        return shadedAnswerBuffer;
    },
    generateHtml: ({numberOfMcqs, numberOfOptions, institution, subject, year, duration, answers}) => {
        let tempContent = "";

        // Header of paper
        tempContent += `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
            </head>
            <body class="bg-white">
                <div class="max-h-full h-full text-black p-7">
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
            tempContent += `<div class='w-full border-1 my-3 px-2'>`;
            const gridCols = `grid-cols-${columns}`; //hardcoded to 28 for now
            const requiredCol = Math.ceil(numberOfMcqs / rowsPerCol) // calculate num of sets of columns
            tempContent += genAnsSheet.renderMcqHeader(options, numberOfOptions, gridCols, requiredCol);
            for (let i = 0; i < rowsPerCol; i++ ) { // for each row (Q1, Q11, Q21, Q31, then Q2, Q12, Q22, Q32, etc)
                tempContent += `<div class="flex align-center items-center grid grid-cols-28 gap-1 pb-1">`
                for (let col = 0; col < requiredCol; col++) { // for each set of columns
                    const questionIndex = i + col * rowsPerCol;
                    const questionNumber = questionIndex + 1;
                    if (questionNumber <= numberOfMcqs) { // only render if question exists
                        tempContent += `<h1 class="text-xs col-span-2 text-center align-middle">${questionNumber}</h1>`
                        for (let i = 0; i < numberOfOptions; i++) { // render options (A, B, C, D, ...)
                            tempContent += `<div class="border-1 col-span-1 aspect-square rounded-full self-center 
                            ${answers[questionIndex] === options[i] ? 'bg-black' : ''}"></div>`
                        }
                    }
                    
                }
                tempContent += "</div>";
            }
            // Render (A, B, C, D...) at the bottom, after all the bubbles
            tempContent += genAnsSheet.renderMcqHeader(options, numberOfOptions, gridCols, requiredCol, true);
            tempContent += `
                        </div>
                    </div>
                </body>
            </html>`;
        }

        return tempContent;
    },
    genAnsSheetLocal: (options, filename) => {
        const html = genAnsSheet.generateHtml(options)
        genAnsSheet.htmlToImg(html, filename);
    }
}

module.exports = genAnsSheet;