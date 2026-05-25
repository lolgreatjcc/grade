import Image from "next/image";
import styles from "./LandingButtons.module.css"

export default function AnswerKeyButton() {

  return (
    <div className="bg-white w-70 h-99 rounded-md m-8 relative overflow-hidden">
      <Image className="max-w-100 max-h-100" alt="img" fill={true} src='https://picsum.photos/200/300'/>
      <div className={`${styles.overlay}`}>
        <svg className={`${styles.uploadIcon}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path fill="currentColor" d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" /></svg>
        <p className={`${styles.caption}`}>Answer Key</p>
      </div>
    </div>
  )
}