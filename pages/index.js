'use-client';

import AnswerKeyButton from "@/components/Landing/AnswerKeyButton";
import AnswerSheetButton from "@/components/Landing/AnswerSheetButton";
import GradeButton from "@/components/Landing/GradeButton";
import Logo from "@/components/Logo";
import Menu from "@/components/Menu/Menu";
import styles from './index.module.css';
import React, { useState } from "react";
import { pdfToImg } from "pdftoimg-js/browser";
import { useSession } from "next-auth/react";
import { useInterval } from "usehooks-ts";

export default function Home() {

  // Stores the answerSheet file and answerKey file.
  // The format for the file obj stems from JS Web API. See: https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications
  const [answerSheet, setAnswerSheet] = useState(null);
  const [answerKey, setAnswerKey] = useState(null);
  


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
      <div className="absolute bottom-10 right-10">
        <h2 className={`${styles.tutorialBtnTxt} text-2xl`}>Need a tutorial?</h2>
      </div>
      <div
        className={`min-h-screen flex items-center justify-center flex-col`}
      >
        <div className="flex">

          <AnswerSheetButton setAnswerSheet={setAnswerSheet} handleFile={handleFile} />

          <AnswerKeyButton setAnswerKey={setAnswerKey} handleFile={handleFile} />

        </div>

        <GradeButton answerSheet={answerSheet} answerKey={answerKey} />
      </div>


    </div>
  );

}
