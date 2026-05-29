import { Ponomar } from "next/font/google"
import styles from './LandingButtons.module.css';
import { useRouter } from "next/router";
import axios from "axios";
import { useLocalStorage } from "usehooks-ts";

const ponomar = Ponomar({
  subsets: ['latin'],
  weight: '400'
})

export default function GradeButton({ answerSheet, answerKey }) {
  const [markedData, saveMarkedData] = useLocalStorage("grade-markedData", null);
  const router = useRouter();

  async function grade(event) {
    event.preventDefault()
    if (answerSheet == null || answerKey == null) {
      return;
    }
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
    })
  }




  return (
    <div className={`${styles.gradeButton} px-20 py-4 rounded-sm`} onClick={grade}>
      <h2 className={`${ponomar.className} text-2xl ${styles.gradeButtonText}`}>grade</h2>
    </div>
  )
}