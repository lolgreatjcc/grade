import { Ponomar } from "next/font/google"
import styles from './LandingButtons.module.css';
import { useRouter } from "next/router";
import axios from "axios";
import { useState } from "react";
import { useSession } from "next-auth/react";

const ponomar = Ponomar({
  subsets: ['latin'],
  weight: '400'
})

export default function GradeButton({ answerSheet, answerKey }) {
  const [requestInProgress, setRequestInProgress] = useState(false);
  const session = useSession().data;
  const router = useRouter();

  async function grade(event) {
    event.preventDefault()
    if (requestInProgress == false) {
      if (answerSheet == null || answerKey == null) {
        return;
      }
      setRequestInProgress(true);
      const formData = new FormData();
      formData.append('user_id', session.user.id)
      formData.append('files', answerSheet);
      formData.append('files', answerKey);
      const response = await axios.post('http://localhost:3001/grade', formData, {
        'headers': { 'Content-Type': 'multipart/form-data' }
      }).then((result) => {
        console.log(session)
        router.push('/grade');
      }).catch((err) => {
        console.log(err.response.data.message)
        setRequestInProgress(false)
      })
    } else {
      // ask user to wait
    }
    
  }


  return (
    <div className={`${styles.gradeButton} px-20 py-4 rounded-sm`} onClick={grade}>
      <h2 className={`${ponomar.className} text-2xl ${styles.gradeButtonText}`}>grade</h2>
    </div>
  )
}