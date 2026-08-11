import { Ponomar } from "next/font/google"
import styles from './Logo.module.css'
import { useRouter } from "next/router"

const ponomar = Ponomar({
  subsets: ['latin'],
  weight: '400'
})

export default function Logo({showBack = false}) {
  const router = useRouter();
  const backToLanding = () => {
    router.replace('/');
  }
  return (
    <div>
      {showBack ? 
      <div className={"flex my-9 cursor-pointer"} onClick={backToLanding}>
        <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="currentColor">
        <path d="m274-450 248 248-42 42-320-320 320-320 42 42-248 248h526v60H274Z" />
      </svg>
      <h1 className="text-xl ms-3">Back</h1>
      </div> : 
      <h2 className={`${ponomar.className} text-8xl ${styles.logoGradient} hover:cursor-pointer`} onClick={backToLanding}>grade</h2>}
    </div>
    
  )
}