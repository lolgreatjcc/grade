import Logo from "@/components/Logo";
import styles from './index.module.css';
import React, { useEffect, useRef, useState } from "react";
import Menu from "@/components/Menu/Menu";
import Mcq from "../../components/Generate/Mcq";
import Oeq from "../../components/Generate/Oeq";
import { Ponomar } from "next/font/google";
import Preview from "../../components/Generate/Preview";
import jsPDF from "jspdf";
import Header from "../../components/Generate/Header";

const ponomar = Ponomar({
    subsets: ['latin'],
    weight: '400'
})

export default function Generate() {
    const [numberOfMcqs, setNumberOfMcqs] = useState(0);
    const [numberOfOptions, setNumberOfOptions] = useState(5);
    const [numberOfOeq, setNumberOfOeq] = useState(0);
    const [oeqData, setOeqData] = useState([]);
    const previewRef = useRef();
    const [institution, setInstitution] = useState("NATIONAL UNIVERSITY OF SINGAPORE");
    const [subject, setSubject] = useState("CS2100 - COMPUTER ORGANISATION");
    const [year, setYear] = useState("(Semester 1: AY2024/25)");
    const [duration, setDuration] = useState("Time Allowed: 2 Hours");

    useEffect(() => {
        console.log(oeqData)
    }, [oeqData])

    const handleGenerateButton = async () => {
        const element = previewRef.current;
        if (!element) return;

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

        await html2pdf().set(options).from(element).save();
    }
 

    return (
        <div className="h-screen w-screen">
            <div className={'h-full flex flex-col'}>
                <div className="ml-10 w-min max-h-min"><Logo /></div>
                <div className="absolute right-5 top-5">
                    <Menu/>
                </div>
                <div className={`grid grid-cols-12 pt-12 pl-12 max-h-full h-full flex-1 min-h-0 overflow-hidden`}>
                    <div className={`grid col-span-7 grid-rows-12 h-full max-h-full overflow-auto`}>
                        <div className={`row-span-10 overflow-auto`}>
                            <Header
                            institution={institution}
                            setInstitution={setInstitution}
                            subject={subject}
                            setSubject={setSubject}
                            year={year}
                            setYear={setYear}
                            duration={duration}
                            setDuration={setDuration}
                            />
                            <Mcq
                            numberOfMcqs={numberOfMcqs}
                            setNumberOfMcqs={setNumberOfMcqs}
                            numberOfOptions={numberOfOptions}
                            setNumberOfOptions={setNumberOfOptions}
                            />
                        
                            <div className={`h-auto`}>
                                <Oeq
                                numberOfMcqs={numberOfMcqs}
                                numberOfOeq={numberOfOeq}
                                setNumberOfOeq={setNumberOfOeq}
                                oeqData={oeqData}
                                setOeqData={setOeqData}
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
                        oeqData={oeqData}
                        previewRef={previewRef}
                        institution={institution}
                        year={year}
                        subject={subject}
                        duration={duration}
                        />
                    </div>

                    
                </div>
            </div>
            
        </div>
    );

}
