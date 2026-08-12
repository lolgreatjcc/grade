import QnSheetButton from "./GenerateOverlaySub/QnSheetButton";
import styles from './GenerateOverlay.module.css'
import { useEffect, useState } from "react";
import { pdfToImg } from "pdftoimg-js/browser";
import GenerateOverlayPopulateButton from "./GenerateOverlaySub/GenerateOverlayPopulateButton";
import { motion } from "motion/react";
import axios from "axios";
import UploadSheetButton from "../Common/FileUpload/UploadSheetButton";

export default function GenerateOverlay({ showOverlay = false, hideOverlay, qnNumbers, setQnNumbers, populateQnNumbers}) {
  if (!showOverlay) return (<></>);

  const [qnSheet, setQnSheet] = useState(null);
  const [requestStarted, setRequestStarted] = useState(false);

  const retrieveQnNumbers = async () => {
    if (qnSheet !== null) {
      setRequestStarted(true);
      const formData = new FormData();
      formData.append('file', qnSheet);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sheetGen`, formData, {
        'Content-Type': 'multipart/form-data'
      }).then((result) => {
        setQnNumbers(result.data)
      })
    }
  }

  useEffect(() => {
    retrieveQnNumbers();
  }, [qnSheet])


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

  const qnSheetName = qnSheet?.name ?? "";


  return (
    <div className={`${styles.generateOverlayParent}`}>
      <h1 className={`${styles.headerText}  text-xl`}>Generate from Question Paper</h1>
      <div className="flex m-10">
        <UploadSheetButton handleFile={handleFile} setSheet={setQnSheet} title="Question Paper" description="Sheet showing just the questions"
        caption={"Question Paper"} disabled={requestStarted}/>
        {!requestStarted ? null :
          qnNumbers === null ?
            <div className="flex flex-col justify-center items-center mb-5">
              <svg className={`mb-2 ${styles.qnSheetLoadingIcon}`} width="50" height="50" viewBox="0 0 200 200">
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
              <h1 className={`${styles.qnSheetLoadingText}`}>Finding Number of Questions</h1>
            </div>
            :
            <div className="flex flex-col justify-center items-center mb-5">
              <div className="tracking-tight flex-col select-none">
                <h1 className={`${styles.qnSheetName}`}>{qnSheetName}</h1>
                <div className="flex items-center flex-col my-10">
                  <h1 className={`text-2xl ${styles.resultNumber}`}>{qnNumbers?.multipleChoice ?? 0}</h1>
                  <h1 className={`${styles.resultText}`}>Multiple-Choice Questions</h1>
                </div>
                <div className="flex items-center flex-col my-10">
                  <h1 className={`text-2xl ${styles.resultNumber}`}>{qnNumbers?.freeResponse ?? 0}</h1>
                  <h1 className={`${styles.resultText}`}>Free Response Questions</h1>
                </div>
              </div>
              <GenerateOverlayPopulateButton populateQnNumbers={populateQnNumbers}/>
            </div>



        }


      </div>
      <h1 onClick={hideOverlay} className={`${styles.overlayManuallyText}`}>Generate manually instead</h1>
    </div>
  )
}