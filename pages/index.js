'use-client';

import UploadSheetButton from "../components/Common/FileUpload/UploadSheetButton";
import GradeButton from "@/components/Landing/GradeButton";
import Logo from "@/components/Logo";
import Menu from "@/components/Menu/Menu";
import styles from './index.module.css';
import React, { useEffect, useState } from "react";
import { pdfToImg } from "pdftoimg-js/browser";
import { useSession } from "next-auth/react";
import { useInterval } from "usehooks-ts";
import ToggleButton from "../components/Landing/ToggleButton";

export default function Home() {

  // Stores the answerSheet file and answerKey file.
  // The format for the file obj stems from JS Web API. See: https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications
  const [answerSheet, setAnswerSheet] = useState(null);
  const [answerKey, setAnswerKey] = useState(null);
  const [questionPaper, setQuestionPaper] = useState(null);
  const [supplementQuestionPaper, setSupplementQuestionPaper] = useState(false);
  const [showTutorialOverlay, setShowTutorialOverlay] = useState(false);
  const [loading, setLoading] = useState(false);


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

        <Menu />
      </div>
      <div className="absolute bottom-10 right-10 cursor-pointer display-none">
        <h2 className={`${styles.tutorialBtnTxt} text-2xl`}>Need a tutorial?</h2>
      </div>
      <div
        className={`min-h-screen flex items-center justify-center flex-col`}
      >
        <div className="flex">

          <UploadSheetButton setSheet={setAnswerSheet} handleFile={handleFile} 
          caption={'Answer Sheet'} disabled={loading}/>
          {supplementQuestionPaper && <UploadSheetButton setSheet={setQuestionPaper} 
          handleFile={handleFile} caption={'Question Paper'} disabled={loading}/>}
          <UploadSheetButton setSheet={setAnswerKey} handleFile={handleFile} 
          caption={'Answer Key'} disabled={loading}/>

        </div>

        <ToggleButton setState={setSupplementQuestionPaper} text={"Supplement Question Paper"} />
        <GradeButton answerSheet={answerSheet} answerKey={answerKey} 
        questionPaper={questionPaper} supplementQuestionPaper={supplementQuestionPaper}
        loading={loading} setLoading={setLoading}/>
      </div>


    </div>
  );

}
