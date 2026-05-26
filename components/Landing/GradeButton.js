import { Ponomar } from "next/font/google"
import styles from './LandingButtons.module.css';
import { useRouter } from "next/router";
const ponomar = Ponomar({
  subsets: ['latin'],
  weight: '400'
})

export default function GradeButton() {

  const router = useRouter();

  return (
    <div className={`${styles.gradeButton} px-20 py-4 rounded-sm`} onClick={() => router.push('./grade')}>
      <h2 className={`${ponomar.className} text-2xl ${styles.gradeButtonText}`}>grade</h2>
    </div>
  )
}