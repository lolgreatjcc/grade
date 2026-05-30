import { Ponomar } from "next/font/google"
import styles from './LandingButtons.module.css';
import { useRouter } from "next/router";
import axios from "axios";
import { useLocalStorage } from "usehooks-ts";
import { useState } from "react";
import { motion } from "motion/react";

const ponomar = Ponomar({
  subsets: ['latin'],
  weight: '400'
})

export default function GradeButton({ answerSheet, answerKey }) {
  const [markedData, saveMarkedData] = useLocalStorage("grade-markedData", null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function grade(event) {
    event.preventDefault()
    if (answerSheet == null || answerKey == null || loading) {
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('files', answerSheet);
    formData.append('files', answerKey)
    console.log(formData);
    const response = await axios.post('http://localhost:3001/grade', formData, {
      'headers': { 'Content-Type': 'multipart/form-data' }
    }).then((result) => {
      saveMarkedData(JSON.parse(result.data.data));
      router.push('/grade');


    }).catch((err) => {
      console.log(err.response.data.message)
    }).finally(() => {
      setLoading(false);
    })
  }




  return (
    <div className={`${styles.gradeButton} px-20 py-4 rounded-sm`} onClick={grade}>
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
    </div>
  )
}