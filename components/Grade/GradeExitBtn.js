
import { useRouter } from 'next/router';
import styles from './GradeExitBtn.module.css';
import { useLocalStorage } from 'usehooks-ts';



export default function GradeExitBtn(props) {

  const [markedData, setMarkedData] = useLocalStorage("grade-markedData");

  const router = useRouter();
  const handleExit = () => {
    setMarkedData(null);
    router.back();
  }

  return (
    <div className={`${styles.exitParent} flex items-center pt-3 ps-3`} onClick={handleExit}>
      <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="currentColor">
        <path d="m274-450 248 248-42 42-320-320 320-320 42 42-248 248h526v60H274Z" />
      </svg>
      <h1 className="text-xl ms-3">Exit</h1>
    </div>
  )
}