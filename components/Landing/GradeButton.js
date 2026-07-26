'use-client';

import { Ponomar } from "next/font/google"
import styles from './LandingButtons.module.css';
import { useRouter } from "next/router";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useLocalStorage } from "usehooks-ts";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useAnswerSheetStore } from "../../providers/answerSheetStoreProvider";
import { OMRChecker } from '@armghan3071/omrchecker';
import omr_template from "../Omr/omr_template";
import { pdfToImg } from "pdftoimg-js/browser";

const ponomar = Ponomar({
  subsets: ['latin'],
  weight: '400'
})

export default function GradeButton({ answerSheet, answerKey, questionPaper, 
  supplementQuestionPaper, loading, setLoading }) {
  const [markedData, saveMarkedData] = useLocalStorage("grade-markedData", null);
  const session = useSession().data;
  const answerSheetImageArr = useAnswerSheetStore((state) => state.answerSheetImageArr);
  const setAnswerSheetImageArr = useAnswerSheetStore((state) => state.setAnswerSheetImageArr);
  const router = useRouter();

  const omr = async (options) => {
    console.log("Running omr");

    const returnTemplate = (numberOfOptions) => {
      if (numberOfOptions === 4) return omr_template.four
      else return omr_template.five;
    }
    const firstPage = await pdfToImg(URL.createObjectURL(answerSheet), { 'pages': 'firstPage' });
    const engine = new OMRChecker();
    const image = firstPage.split(',')[1];
    const binaryString = atob(image);
    let binaryArrayIndex = binaryString.length;
    const uInt8Array = new Uint8Array(binaryArrayIndex);

    while (binaryArrayIndex--) {
      uInt8Array[binaryArrayIndex] = binaryString.charCodeAt(binaryArrayIndex);
    }

    const convertedFile = new File([uInt8Array], 'image.jpg', { 'type': 'image/jpeg' });
    // Load Template & Marker
    const marker = await fetch('./omr_marker.jpg').then(res => res.blob());
    const results = await engine.process([convertedFile], returnTemplate(options?.numberOfOptions) , marker);
    console.log(results)
    if (options?.answersOnly) return Object.values(results[0].response);
    else return results
  }


  // Submits answer sheet and answer key to back-end. 
  async function grade(event) {
    event.preventDefault()
    if (answerSheet == null || answerKey == null || 
      (supplementQuestionPaper == true && questionPaper == null) || loading) {
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('user_id', session ? session.user.user_id : undefined)
      formData.append('files', answerSheet);
      if (supplementQuestionPaper) formData.append('files', questionPaper);
      formData.append('files', answerKey);
      
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/grade`, formData, {
        'headers': session ? { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${session.user.token}` }
                  : { 'Content-Type': 'multipart/form-data'}
    }).then(async (result) => {
      const qrData = result.data.qrData;
      const imageArr = result.data.answer_sheet;

      let omrAnswers = [];
      const questionData = JSON.parse(result.data?.data);
      if (qrData.success && qrData.numberOfMcqs > 15 
        && (qrData.numberOfOptions == 4 || qrData.numberOfOptions == 5)) {
        omrAnswers = await omr({'answersOnly': true, 'numberOfOptions': qrData.numberOfOptions})
        const questionLength = questionData.questions.length;
        for (let i = 0; i < questionLength; i++) {
          if (omrAnswers[i].trim() !== '') {
            questionData.questions[i].omrAnswer = omrAnswers[i];
            questionData.questions[i].isOmr = true;
          } else {
            questionData.questions[i].omrAnswer = "";
            questionData.questions[i].isOmr = false;
          }
        }
      }
      const markedData = { ...questionData, "qrData": result.data.qrData, 'omrAnswers': omrAnswers};

      saveMarkedData(markedData);
      setAnswerSheetImageArr(result.data.answer_sheet)

    }).catch((err) => {
      console.log(err)
    }).finally(() => {
      setLoading(false);
    })
  }

  // Redirects user once data from back-end is saved to store.
  useEffect(() => {
    if (answerSheetImageArr != null) {
      router.push('/grade');
    }
  }, [answerSheetImageArr])

  return (
    <button className={`${styles.gradeButton} px-20 py-4 rounded-sm`} onClick={grade}>
      {loading ?
        <div className={`${styles.loadingParent}`}>

          <svg width="50" height="50" viewBox="0 0 200 200">
            <motion.rect
              x="50"
              y="50"
              width="100"
              height="100"
              fill="currentColor"
              initial={{ scale: 1, rotate: 0 }}
              animate={{ scale: [1, 1.2, 1], rotate: 360 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </svg>
          <h1 className="m-5">Marking...</h1>
        </div>
        :
        <h2 className={`${ponomar.className} text-2xl ${styles.gradeButtonText}`}>grade</h2>
      }
    </button>
  )
}