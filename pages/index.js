import AnswerKeyButton from "@/components/Landing/AnswerKeyButton";
import AnswerSheetButton from "@/components/Landing/AnswerSheetButton";
import GradeButton from "@/components/Landing/GradeButton";
import Logo from "@/components/Logo";
import styles from './index.module.css';
import React, { useState } from "react";
import { pdfToImg } from "pdftoimg-js/browser";

export default function Home() {

  const [answerSheet, setAnswerSheet] = useState(null);
  const [answerKey, setAnswerKey] = useState(null);

  const handleFile = async (event, setFileState, setPreviewImage) => {
    const file = event.target.files[0];
    if (file) {
      const fileSize = file.size;
      if (fileSize > 5242880) {
        console.log("file too big")
        return false;
      } else {
        const previewImage = await pdfToImg(URL.createObjectURL(file), {'pages': 'firstPage'});
        setPreviewImage(previewImage);
        setFileState(file);
        return true;
      }
    } else {
      setPreviewImage(null);
      return null;
    }
      
  }

  return (
    <div className="min-h-screen">
      <div className="absolute left-10"><Logo /></div>
      <div className="absolute right-5 top-5">

        <svg className={`${styles.menuBtn}`} xmlns="http://www.w3.org/2000/svg" height="64px" viewBox="0 -960 960 960" width="64px">
          <path fill="currentColor" d="M120-240v-60h720v60H120Zm0-210v-60h720v60H120Zm0-210v-60h720v60H120Z" />
        </svg>
      </div>
      <div className="absolute bottom-10 right-10">
        <h2 className={`${styles.tutorialBtnTxt} text-2xl`}>Need a tutorial?</h2>
      </div>
      <div
        className={`min-h-screen flex items-center justify-center flex-col`}
      >
        <div className="flex">

          <AnswerSheetButton setAnswerSheet={setAnswerSheet} handleFile={handleFile}/>

          <AnswerKeyButton setAnswerKey={setAnswerKey} handleFile={handleFile}/>

        </div>

        <GradeButton answerSheet={answerSheet} answerKey={answerKey}/>
      </div>


    </div>
  );

}
