import Logo from "@/components/Logo";
import styles from './index.module.css';
import React, { useEffect, useRef, useState } from "react";
import Menu from "@/components/Menu/Menu";
import Mcq from "../../components/Generate/Mcq";
import Oec from "../../components/Generate/Oec";
import { Ponomar } from "next/font/google";
import Preview from "../../components/Generate/Preview";
import jsPDF from "jspdf";

const ponomar = Ponomar({
    subsets: ['latin'],
    weight: '400'
})

export default function Generate() {
    const [numberOfMcqs, setNumberOfMcqs] = useState(0);
    const [numberOfOptions, setNumberOfOptions] = useState(5);
    const [numberOfOec, setNumberOfOec] = useState(0);
    const [oecData, setOecData] = useState([]);
    const previewRef = useRef();

    useEffect(() => {
        console.log(oecData)
    }, [oecData])

    const handleGenerateButton = async () => {
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
        
        pdf.save("generated_answer_sheet.pdf");
    }
 

    return (
        <div className="h-screen w-screen">
            <div className={'h-full flex flex-col'}>
                <div className="ml-10 w-min max-h-min"><Logo /></div>
                <div className="absolute right-5 top-5">
                    <Menu/>
                </div>
                <div className={`grid grid-cols-12 pt-12 pl-12 pr-12 max-h-full h-full flex-1 min-h-0 overflow-hidden`}>
                    <div className={`grid col-span-7 grid-rows-12 h-full max-h-full overflow-auto`}>
                        <div className={`row-span-10 overflow-auto`}>
                            <Mcq
                            numberOfMcqs={numberOfMcqs}
                            setNumberOfMcqs={setNumberOfMcqs}
                            numberOfOptions={numberOfOptions}
                            setNumberOfOptions={setNumberOfOptions}
                            />
                        
                            <div className={`h-auto`}>
                                <Oec
                                numberOfMcqs={numberOfMcqs}
                                numberOfOec={numberOfOec}
                                setNumberOfOec={setNumberOfOec}
                                oecData={oecData}
                                setOecData={setOecData}
                                />
                            </div>
                        </div>
                        
                        <div className={`${styles.generateButtonContainer} row-span-2`}>
                            <div className={`${styles.generateButton} px-20 py-4 rounded-sm`} onClick={handleGenerateButton}>
                                <h2 className={`${ponomar.className} text-2xl ${styles.generateButtonText}`}>Generate</h2>
                            </div>
                        </div>
                            
                                                    
                    </div>
                    <div className={`col-span-5 flex-1 min-h-0`}>
                        <Preview
                        numberOfMcqs={numberOfMcqs}
                        numberOfOptions={numberOfOptions}
                        oecData={oecData}
                        previewRef={previewRef}
                        />
                    </div>

                    
                </div>
            </div>
            
        </div>
    );

}
